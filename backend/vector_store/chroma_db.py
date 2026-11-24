"""
LegalMind AI - ChromaDB Vector Store
Manages persistent vector storage, indexing, semantic queries, and document deletion.
"""

from typing import List, Dict, Any, Optional
from pathlib import Path
import chromadb
from chromadb.config import Settings as ChromaSettings
from backend.config import settings

class ChromaDBStore:
    """
    Singleton wrapper for ChromaDB persistent client and collection operations.
    """

    _instance: Optional["ChromaDBStore"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ChromaDBStore, cls).__new__(cls)
            cls._instance._init_db()
        return cls._instance

    def _init_db(self):
        """Initializes the persistent ChromaDB client and legal collection."""
        Path(settings.CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        # Using cosine space: distance = 1 - cosine_similarity
        self.collection = self.client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(
        self,
        chunks: List[Dict[str, Any]],
        embeddings: List[List[float]]
    ) -> int:
        """
        Upserts chunk texts, embeddings, and metadata into ChromaDB.
        Prevents duplicate errors by using unique deterministic IDs.
        """
        if not chunks:
            return 0

        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        for chunk in chunks:
            ids.append(chunk["chunk_id"])
            documents.append(chunk["text"])

            # ChromaDB metadata values must be primitive types (str, int, float, bool)
            meta = {
                "document_id": str(chunk.get("document_id", "")),
                "document_name": str(chunk.get("document_name", "")),
                "page_number": int(chunk.get("page_number", 1)),
                "section": str(chunk.get("section") or ""),
                "act_name": str(chunk.get("act_name") or ""),
                "chapter": str(chunk.get("chapter") or ""),
                "is_statutory": bool(chunk.get("is_statutory", False)),
                "character_count": int(chunk.get("character_count", len(chunk["text"])))
            }
            metadatas.append(meta)

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=documents
        )

        return len(ids)

    def query_similar(
        self,
        query_embedding: List[float],
        top_k: int = 4,
        where: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Performs vector similarity search against the collection.
        Derives cosine similarity score from cosine distance: score = 1.0 - distance.
        """
        count = self.collection.count()
        if count == 0:
            return []

        actual_k = min(top_k, count)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=actual_k,
            where=where,
            include=["documents", "metadatas", "distances"]
        )

        matched_chunks: List[Dict[str, Any]] = []

        if not results or not results["ids"] or not results["ids"][0]:
            return []

        ids = results["ids"][0]
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0] if results.get("distances") else [0.0] * len(ids)

        for i in range(len(ids)):
            dist = float(distances[i])
            # For cosine distance: distance is in [0, 2], similarity is 1.0 - distance
            # Clamped to [0.0, 1.0] for normalized embeddings
            similarity_score = max(0.0, min(1.0, 1.0 - dist))

            matched_chunks.append({
                "chunk_id": ids[i],
                "text": docs[i],
                "document_id": metas[i].get("document_id"),
                "document_name": metas[i].get("document_name"),
                "page_number": metas[i].get("page_number", 1),
                "section": metas[i].get("section") if metas[i].get("section") else None,
                "act_name": metas[i].get("act_name") if metas[i].get("act_name") else None,
                "score": round(similarity_score, 4)
            })

        return matched_chunks

    def delete_document(self, document_id: str) -> int:
        """
        Deletes all chunks belonging to a specific document ID.
        """
        before_count = self.collection.count()
        try:
            self.collection.delete(where={"document_id": document_id})
        except Exception as e:
            # If no items match, Chroma may raise an error or return silently
            pass
        after_count = self.collection.count()
        return max(0, before_count - after_count)

    def list_documents(self) -> List[Dict[str, Any]]:
        """
        Returns aggregated metadata of all currently indexed documents.
        """
        total = self.collection.count()
        if total == 0:
            return []

        # Retrieve all metadatas
        data = self.collection.get(include=["metadatas"])
        docs_map: Dict[str, Dict[str, Any]] = {}

        if data and data.get("metadatas"):
            for meta in data["metadatas"]:
                doc_id = meta.get("document_id")
                if not doc_id:
                    continue

                if doc_id not in docs_map:
                    docs_map[doc_id] = {
                        "document_id": doc_id,
                        "filename": meta.get("document_name", "Unknown Document"),
                        "page_count": meta.get("page_number", 1),
                        "chunk_count": 0,
                        "act_name": meta.get("act_name"),
                        "is_statutory": meta.get("is_statutory", False)
                    }

                docs_map[doc_id]["chunk_count"] += 1
                if meta.get("page_number", 1) > docs_map[doc_id]["page_count"]:
                    docs_map[doc_id]["page_count"] = meta.get("page_number", 1)

        return list(docs_map.values())

    def count_chunks(self) -> int:
        """Returns total number of chunks currently indexed."""
        return self.collection.count()

def get_chroma_store() -> ChromaDBStore:
    return ChromaDBStore()
