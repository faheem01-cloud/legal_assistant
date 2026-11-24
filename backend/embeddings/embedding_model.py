"""
LegalMind AI - Local Embedding Engine
Generates local embeddings using Sentence Transformers (all-MiniLM-L6-v2)
without sending legal text to external embedding APIs.
"""

from typing import List, Optional
import numpy as np
from backend.config import settings

class EmbeddingEngine:
    """
    Singleton wrapper for sentence-transformers model.
    Loads the model once in memory and provides normalized batch and query embeddings.
    """

    _instance: Optional["EmbeddingEngine"] = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingEngine, cls).__new__(cls)
        return cls._instance

    def _ensure_model_loaded(self):
        """Lazy load model into memory on first invocation."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
            except Exception as e:
                raise RuntimeError(
                    f"Failed to load embedding model '{settings.EMBEDDING_MODEL_NAME}': {str(e)}"
                )

    def embed_documents(self, texts: List[str], batch_size: int = 32) -> List[List[float]]:
        """
        Embeds a list of document chunk texts using efficient batch processing.
        Returns L2-normalized float embeddings.
        """
        if not texts:
            return []

        # Sanitize empty strings
        cleaned = [t if (t and t.strip()) else "empty passage" for t in texts]

        self._ensure_model_loaded()
        embeddings = self._model.encode(
            cleaned,
            batch_size=batch_size,
            show_progress_bar=False,
            normalize_embeddings=True,
            convert_to_numpy=True
        )

        return embeddings.tolist()

    def embed_query(self, query: str) -> List[float]:
        """
        Generates a normalized embedding vector for a single query.
        """
        if not query or not query.strip():
            # Return zero vector for empty query
            return [0.0] * 384

        self._ensure_model_loaded()
        embedding = self._model.encode(
            query.strip(),
            normalize_embeddings=True,
            convert_to_numpy=True
        )

        return embedding.tolist()

    @property
    def dimension(self) -> int:
        """Returns embedding dimensionality (384 for all-MiniLM-L6-v2)."""
        return 384

# Global singleton accessor
def get_embedding_engine() -> EmbeddingEngine:
    return EmbeddingEngine()
