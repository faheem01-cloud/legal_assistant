"""
LegalMind AI - Legal Library API Router
Returns metadata of indexed central acts, constitutional provisions, and case law.
"""

from typing import List
from fastapi import APIRouter, Depends
from backend.schemas.request_models import LibraryResponse, LibraryDocumentItem
from backend.vector_store.chroma_db import get_chroma_store, ChromaDBStore

router = APIRouter(prefix="/library", tags=["Legal Knowledge Library"])

# Curated reference registry of Indian legislation
DEFAULT_INDIAN_ACTS_REGISTRY = [
    {
        "document_id": "act-contract-1872",
        "title": "The Indian Contract Act, 1872",
        "category": "Civil Law",
        "type": "Central Legislation",
        "description": "Governs the formation, breach, damages (s. 73), and performance of contracts in India."
    },
    {
        "document_id": "act-ni-1881",
        "title": "The Negotiable Instruments Act, 1881",
        "category": "Banking & Commercial",
        "type": "Commercial Statute",
        "description": "Governs promissory notes, bills of exchange, and dishonour of cheques under Section 138."
    },
    {
        "document_id": "act-bns-2023",
        "title": "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "category": "Criminal Law",
        "type": "Penal Code",
        "description": "The modern penal code of India replacing the Indian Penal Code 1860."
    },
    {
        "document_id": "act-copra-2019",
        "title": "Consumer Protection Act, 2019",
        "category": "Consumer Rights",
        "type": "Welfare Legislation",
        "description": "Regulates consumer protection, product liability, and unfair trade practices."
    },
    {
        "document_id": "act-it-2000",
        "title": "Information Technology Act, 2000",
        "category": "Cyber Law",
        "type": "Technology Law",
        "description": "Legal framework for electronic records, cyber contraventions, and computer offences."
    },
    {
        "document_id": "act-dpdp-2023",
        "title": "Digital Personal Data Protection Act, 2023",
        "category": "Privacy Law",
        "type": "Data Protection",
        "description": "Governs processing of digital personal data and rights of Data Principals in India."
    }
]

@router.get(
    "",
    response_model=LibraryResponse,
    summary="Get legal knowledge library",
    description="Returns metadata of available Indian statutes, acts, and indexed documents."
)
async def get_library_sources(
    vector_store: ChromaDBStore = Depends(get_chroma_store)
) -> LibraryResponse:
    indexed_docs = vector_store.list_documents()
    total_chunks = vector_store.count_chunks()

    items: List[LibraryDocumentItem] = []

    # Map indexed documents from ChromaDB
    for doc in indexed_docs:
        items.append(LibraryDocumentItem(
            document_id=doc["document_id"],
            title=doc.get("act_name") or doc.get("filename") or "Indexed Document",
            category="User Uploaded Document" if not doc.get("is_statutory") else "Statutory Legislation",
            type="Vector Chunks Corpus",
            total_chunks=doc.get("chunk_count", 0),
            total_pages=doc.get("page_count", 1),
            description=f"Indexed in ChromaDB: {doc.get('chunk_count', 0)} passages from {doc.get('filename')}."
        ))

    # Supplement with default Indian acts registry if no user docs exist
    if not items:
        for ref in DEFAULT_INDIAN_ACTS_REGISTRY:
            items.append(LibraryDocumentItem(
                document_id=ref["document_id"],
                title=ref["title"],
                category=ref["category"],
                type=ref["type"],
                total_chunks=0,
                total_pages=0,
                description=ref["description"]
            ))

    return LibraryResponse(
        total_documents=len(items),
        total_chunks=total_chunks,
        documents=items
    )
