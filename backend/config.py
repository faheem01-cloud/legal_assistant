"""
LegalMind AI - Backend Configuration
Centralizes all application constants, paths, and environment configurations.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env file if present
load_dotenv(BASE_DIR / ".env")

class Settings:
    # API metadata
    API_TITLE: str = "LegalMind AI — Indian Legal RAG Assistant API"
    API_DESCRIPTION: str = (
        "Evidence-grounded Indian law research and document intelligence backend. "
        "Implements PyMuPDF extraction, Sentence Transformers embeddings, ChromaDB vector storage, "
        "and DeepSeek RAG generation."
    )
    API_VERSION: str = "1.0.0"

    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

    # CORS origins for Vite React frontend
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
        if origin.strip()
    ]
    CORS_ORIGIN_REGEX: str = os.getenv(
        "CORS_ORIGIN_REGEX",
        r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$"
    )

    # DeepSeek LLM configuration
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "").strip()
    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    DEEPSEEK_BASE_URL: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
    LLM_TIMEOUT_SECONDS: float = float(os.getenv("LLM_TIMEOUT_SECONDS", "45.0"))
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.2"))
    LLM_MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "1500"))

    # Embeddings & Vector Database
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
    CHROMA_PERSIST_DIR: str = str(
        Path(os.getenv("CHROMA_PERSIST_DIR", str(BASE_DIR / "data" / "chroma_db"))).resolve()
    )
    CHROMA_COLLECTION_NAME: str = os.getenv("CHROMA_COLLECTION_NAME", "legalmind_knowledge_base")

    # Chunking parameters (tokens/character estimates)
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "800"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "120"))

    # Retrieval parameters
    RETRIEVAL_TOP_K: int = int(os.getenv("RETRIEVAL_TOP_K", "4"))
    RELEVANCE_THRESHOLD: float = float(os.getenv("RELEVANCE_THRESHOLD", "0.25"))

    # File uploads & samples
    UPLOAD_DIR: Path = BASE_DIR / "data" / "uploads"
    SAMPLES_DIR: Path = BASE_DIR / "data" / "samples"
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "25"))
    MAX_UPLOAD_SIZE_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    ALLOWED_EXTENSIONS: set[str] = {".pdf"}

    def ensure_directories(self) -> None:
        """Create necessary data directories if they do not exist."""
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        self.SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
        Path(self.CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)

settings = Settings()
settings.ensure_directories()
