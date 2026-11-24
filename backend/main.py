"""
LegalMind AI — Indian Legal RAG Assistant Backend
FastAPI entry point configuring routers, CORS, exception handling,
and startup lifecycle management.
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path regardless of where command is executed
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.schemas.request_models import HealthResponse
from backend.api.chat import router as chat_router
from backend.api.documents import router as documents_router
from backend.api.library import router as library_router
from backend.embeddings.embedding_model import get_embedding_engine
from backend.vector_store.chroma_db import get_chroma_store
from backend.generation.llm import get_llm_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle management.
    Initializes storage directories and pre-loads the singleton embedding model once.
    """
    settings.ensure_directories()
    # Initialize persistent ChromaDB store
    chroma = get_chroma_store()
    # Pre-warm embedding engine so subsequent queries are instant
    try:
        engine = get_embedding_engine()
        # Pre-warm with a tiny string to load model weights into memory
        engine.embed_query("warmup Indian jurisprudence")
    except Exception as e:
        print(f"[Warning] Lazy loading embedding model due to: {e}")

    yield
    # Shutdown logic if needed

# Initialize FastAPI App
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

@app.get("/")
def home():
    return {"message": "Legal RAG Assistant API is running"}

# Configure CORS for React Vite frontend (allows all localhost ports: 5173, 5174, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Unhandled Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred processing your legal research request.",
            "detail": str(exc) if settings.DEBUG else None
        }
    )

# Register Routers under /api
api_prefix = "/api"
app.include_router(chat_router, prefix=api_prefix)
app.include_router(documents_router, prefix=api_prefix)
app.include_router(library_router, prefix=api_prefix)

# Health Endpoint
@app.get(
    "/api/health",
    response_model=HealthResponse,
    tags=["System Health"],
    summary="Application Health Check"
)
async def health_check() -> HealthResponse:
    """
    Returns system status, active embedding model, and indexed chunk count.
    """
    store = get_chroma_store()
    llm = get_llm_client()
    chunk_count = store.count_chunks()

    return HealthResponse(
        status="healthy",
        application="LegalMind AI",
        embedding_model=settings.EMBEDDING_MODEL_NAME,
        indexed_chunks=chunk_count,
        deepseek_configured=llm.is_configured()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT
    )
