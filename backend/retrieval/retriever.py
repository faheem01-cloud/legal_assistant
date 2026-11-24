"""
LegalMind AI - Semantic Retriever
Coordinates query embedding and vector similarity retrieval against ChromaDB.
Filters results by relevance threshold and deduplicates chunks.
"""

from typing import List, Dict, Any, Optional
from backend.config import settings
from backend.embeddings.embedding_model import get_embedding_engine
from backend.vector_store.chroma_db import get_chroma_store

class SemanticRetriever:
    """
    Executes semantic vector retrieval against the legal ChromaDB collection.
    """

    def __init__(
        self,
        top_k: int = None,
        relevance_threshold: float = None
    ):
        self.top_k = top_k or settings.RETRIEVAL_TOP_K
        self.relevance_threshold = relevance_threshold or settings.RELEVANCE_THRESHOLD
        self.embedding_engine = get_embedding_engine()
        self.vector_store = get_chroma_store()

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes semantic search for a user question.

        Workflow:
        1. Query -> Embedding
        2. ChromaDB semantic search
        3. Filter by relevance threshold
        4. Deduplicate text chunks
        5. Return structured evidence passages with genuine cosine scores
        """
        if not query or not query.strip():
            return []

        k = top_k or self.top_k

        # 1. Generate query embedding locally
        query_embedding = self.embedding_engine.embed_query(query.strip())

        # 2. Query ChromaDB
        candidates = self.vector_store.query_similar(
            query_embedding=query_embedding,
            top_k=k * 2,  # Fetch slightly wider pool for thresholding and deduplication
            where=filter_metadata
        )

        if not candidates:
            return []

        # 3. Filter by relevance score & deduplicate identical texts
        filtered_results: List[Dict[str, Any]] = []
        seen_texts = set()

        for chunk in candidates:
            score = chunk.get("score", 0.0)

            # Apply relevance threshold
            if score < self.relevance_threshold:
                continue

            text_snippet = chunk["text"][:120].strip().lower()
            if text_snippet in seen_texts:
                continue

            seen_texts.add(text_snippet)
            filtered_results.append(chunk)

            if len(filtered_results) >= k:
                break

        return filtered_results

def get_retriever() -> SemanticRetriever:
    return SemanticRetriever()
