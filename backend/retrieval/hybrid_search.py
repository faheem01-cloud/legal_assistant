"""
LegalMind AI - Hybrid Search Engine (Phase 2 Architecture)
Combines dense semantic retrieval and sparse lexical search using Reciprocal Rank Fusion (RRF).
"""

from typing import List, Dict, Any
from backend.retrieval.retriever import SemanticRetriever
from backend.retrieval.bm25 import BM25Retriever
from backend.retrieval.reranker import CrossEncoderReranker

class HybridSearchEngine:
    """
    Phase 2: Fuses dense semantic search with BM25 keyword matching
    using Reciprocal Rank Fusion (RRF) and Cross-Encoder reranking.
    """

    def __init__(self):
        self.semantic_retriever = SemanticRetriever()
        self.bm25_retriever = BM25Retriever()
        self.reranker = CrossEncoderReranker()

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Executes hybrid search pipeline:
        1. Dense retrieval (ChromaDB)
        2. Sparse retrieval (BM25)
        3. Reciprocal Rank Fusion (RRF)
        4. Cross-Encoder reranking
        """
        # In Phase 1, delegates to dense semantic retriever
        dense_results = self.semantic_retriever.retrieve(query, top_k=top_k)
        return self.reranker.rerank(query, dense_results, top_k=top_k)
