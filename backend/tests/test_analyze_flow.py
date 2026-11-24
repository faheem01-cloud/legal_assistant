"""
Integration test for Document Analysis with storage persistence and embedding creation.
"""

import io
import fitz
from fastapi.testclient import TestClient
from backend.main import app
from backend.config import settings
from backend.vector_store.chroma_db import get_chroma_store

client = TestClient(app)

def test_analyze_persists_pdf_and_creates_embeddings():
    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200

    # 2. Call /api/documents/analyze with a sample legal PDF
    res = client.post(
        "/api/documents/analyze",
        data={"sample_name": "Commercial_Office_Lease_Deed_Bengaluru.pdf"}
    )
    assert res.status_code == 200
    data = res.json()

    doc_id = data.get("document_id")
    assert doc_id is not None
    assert data["fileName"] == "Commercial_Office_Lease_Deed_Bengaluru.pdf"
    assert data["chunkCount"] > 0
    assert "Commercial Lease" in data["overview"]["documentType"]

    # 3. Verify PDF is saved to disk in settings.UPLOAD_DIR
    matching_files = list(settings.UPLOAD_DIR.glob(f"{doc_id}_*.pdf"))
    assert len(matching_files) == 1
    assert matching_files[0].exists()

    # 4. Verify document is indexed in ChromaDB
    store = get_chroma_store()
    docs = store.list_documents()
    indexed_doc = next((d for d in docs if d["document_id"] == doc_id), None)
    assert indexed_doc is not None
    assert indexed_doc["chunk_count"] > 0

    # 5. Verify RAG search can retrieve from this analyzed document
    chat_res = client.post(
        "/api/chat",
        json={"question": "What is the lock-in period in the commercial lease deed?"}
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert len(chat_data["sources"]) > 0
    source_names = [s["document_name"] for s in chat_data["sources"]]
    assert "Commercial_Office_Lease_Deed_Bengaluru.pdf" in source_names

def test_analyze_uploaded_file_bytes():
    # Generate a dynamic PDF in memory
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (50, 72),
        "MUTUAL NON-DISCLOSURE COVENANT\n"
        "Entered into under Section 27 of the Indian Contract Act, 1872.\n"
        "Parties agree to strict confidentiality for proprietary trade secrets."
    )
    pdf_bytes = doc.write()
    doc.close()

    res = client.post(
        "/api/documents/analyze",
        files={"file": ("Dynamic_NDA_Agreement.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    )
    assert res.status_code == 200
    data = res.json()

    doc_id = data.get("document_id")
    assert doc_id is not None
    assert data["fileName"] == "Dynamic_NDA_Agreement.pdf"
    assert data["chunkCount"] > 0

    # Verify physical file saved to backend/data/uploads
    saved_files = list(settings.UPLOAD_DIR.glob(f"{doc_id}_*.pdf"))
    assert len(saved_files) == 1
    assert saved_files[0].is_file()

    # Verify indexed into ChromaDB
    store = get_chroma_store()
    docs = store.list_documents()
    indexed = [d for d in docs if d["document_id"] == doc_id]
    assert len(indexed) == 1
    assert indexed[0]["chunk_count"] > 0

    # Clean up test artifact from ChromaDB and storage
    store.delete_document(doc_id)
    if saved_files[0].exists():
        saved_files[0].unlink()
