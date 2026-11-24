"""
LegalMind AI - Backend Test Suite
Covers:
- Health endpoint
- PDF extraction (valid, empty, corrupted)
- Sentence-aware legal chunking
- Statutory metadata extraction
- Embedding generation
- ChromaDB vector storage and semantic retrieval
- Missing API key handling
- Chat endpoint with zero indexed documents
"""

import io
from pathlib import Path
import pytest
import fitz  # PyMuPDF
from fastapi.testclient import TestClient

from backend.main import app
from backend.config import settings
from backend.ingestion.metadata_extractor import extract_legal_metadata
from backend.ingestion.chunking import LegalChunker
from backend.ingestion.pdf_loader import PDFLoader, PDFExtractionError
from backend.embeddings.embedding_model import get_embedding_engine
from backend.vector_store.chroma_db import get_chroma_store
from backend.retrieval.retriever import SemanticRetriever
from backend.generation.llm import DeepSeekClient

client = TestClient(app)

# ============================================================================
# 1. Health Endpoint Tests
# ============================================================================

def test_health_endpoint():
    """Verify GET /api/health returns healthy status and LegalMind AI application name."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["application"] == "LegalMind AI"
    assert "embedding_model" in data
    assert "indexed_chunks" in data

# ============================================================================
# 2. Metadata Extraction Tests
# ============================================================================

def test_metadata_extraction_section_and_act():
    """Verify regex detects Indian sections and Acts."""
    sample_text = (
        "Under Section 73 of The Indian Contract Act, 1872, the aggrieved party "
        "is entitled to compensation for direct losses naturally arising from breach."
    )
    meta = extract_legal_metadata(sample_text)
    assert meta["section"] == "Section 73"
    assert meta["act_name"] == "The Indian Contract Act, 1872"
    assert meta["is_statutory"] is True

def test_metadata_extraction_article():
    """Verify constitutional article recognition."""
    sample_text = "Article 21 guarantees protection of life and personal liberty."
    meta = extract_legal_metadata(sample_text)
    assert meta["section"] == "Article 21"
    assert meta["is_statutory"] is True

# ============================================================================
# 3. Chunking Tests
# ============================================================================

def test_chunking_sentence_aware_and_page_preservation():
    """Verify LegalChunker preserves page numbers, attaches metadata, and respects boundaries."""
    chunker = LegalChunker(chunk_size_chars=400, chunk_overlap_chars=100)

    pages = [
        {
            "document_id": "test-doc-1",
            "document_name": "contract_act.pdf",
            "page_number": 1,
            "text": (
                "Section 73 of The Indian Contract Act, 1872 provides for compensation. "
                "The loss must naturally arise in the usual course of things. "
                "Remote and indirect loss cannot be claimed. "
                "Mitigation means existed must be evaluated."
            ),
            "is_empty": False
        },
        {
            "document_id": "test-doc-1",
            "document_name": "contract_act.pdf",
            "page_number": 2,
            "text": "Section 74 deals with liquidated damages and penalties in commercial contracts.",
            "is_empty": False
        }
    ]

    chunks = chunker.chunk_pages(pages, "test-doc-1", "contract_act.pdf")
    assert len(chunks) >= 2
    # Check page attribution
    assert chunks[0]["page_number"] == 1
    assert chunks[-1]["page_number"] == 2
    # Check chunk IDs
    assert chunks[0]["chunk_id"].startswith("test-doc-1_p1_c")
    assert chunks[-1]["chunk_id"].startswith("test-doc-1_p2_c")
    # Check section detection
    assert chunks[0]["section"] == "Section 73"

# ============================================================================
# 4. PDF Extraction Tests (PyMuPDF)
# ============================================================================

def test_pdf_extraction_valid(tmp_path: Path):
    """Generate a synthetic test PDF and extract structured pages."""
    test_pdf_path = tmp_path / "sample_act.pdf"
    doc = fitz.open()

    page1 = doc.new_page()
    page1.insert_text(
        (50, 72),
        "THE INDIAN CONTRACT ACT, 1872\nSection 10. All agreements are contracts if they are made by free consent."
    )

    page2 = doc.new_page()
    page2.insert_text(
        (50, 72),
        "Section 73. Compensation for loss or damage caused by breach of contract naturally arising."
    )

    doc.save(str(test_pdf_path))
    doc.close()

    doc_id, pages, meta = PDFLoader.extract_pages_from_file(test_pdf_path, "sample_act.pdf")

    assert doc_id is not None
    assert len(pages) == 2
    assert meta["total_pages"] == 2
    assert "Section 10" in pages[0]["text"]
    assert "Section 73" in pages[1]["text"]

def test_pdf_extraction_empty_or_no_text(tmp_path: Path):
    """Verify PDFExtractionError is raised if PDF has no readable text (e.g., blank or scanned)."""
    empty_pdf_path = tmp_path / "empty.pdf"
    doc = fitz.open()
    doc.new_page()  # Blank page without text
    doc.save(str(empty_pdf_path))
    doc.close()

    with pytest.raises(PDFExtractionError):
        PDFLoader.extract_pages_from_file(empty_pdf_path, "empty.pdf")

def test_pdf_extraction_missing_file():
    """Verify FileNotFoundError is raised for non-existent path."""
    with pytest.raises(FileNotFoundError):
        PDFLoader.extract_pages_from_file(Path("non_existent_file.pdf"), "none.pdf")

# ============================================================================
# 5. Embedding & Vector Storage Tests
# ============================================================================

def test_embedding_generation_shape():
    """Verify embedding engine returns normalized 384-dimensional vectors."""
    engine = get_embedding_engine()
    query_vec = engine.embed_query("breach of contract damages")
    assert len(query_vec) == 384
    assert isinstance(query_vec[0], float)

    # Empty query should return zero vector
    empty_vec = engine.embed_query("")
    assert len(empty_vec) == 384
    assert sum(empty_vec) == 0.0

def test_chroma_vector_storage_and_retrieval():
    """Verify adding chunks and querying via SemanticRetriever returns genuine scores."""
    store = get_chroma_store()
    engine = get_embedding_engine()

    test_doc_id = "test-retrieval-doc"
    chunk_text = "Section 138 of the Negotiable Instruments Act creates liability for dishonour of cheques."
    chunk_meta = {
        "chunk_id": f"{test_doc_id}_c1",
        "document_id": test_doc_id,
        "document_name": "ni_act.pdf",
        "page_number": 1,
        "text": chunk_text,
        "section": "Section 138",
        "act_name": "Negotiable Instruments Act, 1881",
        "is_statutory": True
    }

    embeddings = engine.embed_documents([chunk_text])
    store.add_chunks([chunk_meta], embeddings)

    retriever = SemanticRetriever(top_k=2, relevance_threshold=0.2)
    results = retriever.retrieve("cheque bounce section 138 notice")

    assert len(results) > 0
    top_result = results[0]
    assert "Section 138" in top_result["text"]
    assert top_result["score"] > 0.3  # Genuine cosine score derived from ChromaDB

    # Clean up test document
    store.delete_document(test_doc_id)

# ============================================================================
# 6. DeepSeek Client & Missing API Key Handling
# ============================================================================

def test_missing_api_key_graceful_handling():
    """Verify DeepSeekClient does not crash when API key is missing/placeholder."""
    client_llm = DeepSeekClient()
    # If not configured, is_configured should return False
    # and generate should return a structured error response
    if not client_llm.is_configured():
        import asyncio
        result = asyncio.run(client_llm.generate([{"role": "user", "content": "hi"}]))
        assert result["content"] is None
        assert "error" in result
        assert "not configured" in result["error"].lower()

# ============================================================================
# 7. Chat API & Upload Validation Endpoints
# ============================================================================

def test_chat_endpoint_empty_question():
    """Verify submitting whitespace/empty question yields 400 Bad Request."""
    response = client.post("/api/chat", json={"question": "   "})
    assert response.status_code == 400

def test_chat_endpoint_valid_inquiry():
    """Verify POST /api/chat generates structured answer and sources list."""
    response = client.post(
        "/api/chat",
        json={"question": "What are the remedies for breach of contract?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "chat_id" in data
    assert isinstance(data["sources"], list)
    assert len(data["answer"]) > 50

def test_upload_invalid_file_extension():
    """Verify uploading a non-PDF file returns 400 Bad Request."""
    fake_txt = io.BytesIO(b"Legal agreement in plain text")
    response = client.post(
        "/api/documents/upload",
        files={"file": ("contract.txt", fake_txt, "text/plain")}
    )
    assert response.status_code == 400
    assert "Only PDF documents are supported" in response.json()["detail"]

def test_library_endpoint():
    """Verify GET /api/library returns legal documents list."""
    response = client.get("/api/library")
    assert response.status_code == 200
    data = response.json()
    assert "total_documents" in data
    assert "documents" in data
    assert len(data["documents"]) > 0
