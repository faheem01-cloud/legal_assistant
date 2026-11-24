"""
LegalMind AI - Pydantic Request & Response Schemas
Provides strict type validation and automatic Swagger schema generation.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

# ============================================================================
# Chat Schemas
# ============================================================================

class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=2,
        max_length=2000,
        description="The legal inquiry or question to research",
        examples=["What are the legal remedies for breach of contract under Section 73?"]
    )
    chat_id: Optional[str] = Field(
        default=None,
        description="Optional session ID to associate or continue an inquiry"
    )

class SourceItem(BaseModel):
    document_id: str = Field(..., description="Unique ID of the ingested document")
    document_name: str = Field(..., description="Original filename of the legal document")
    page_number: int = Field(..., description="1-indexed page number of the source chunk")
    section: Optional[str] = Field(default=None, description="Identified legal section, e.g. Section 73")
    text: str = Field(..., description="Extracted contextual passage from the source text")
    score: float = Field(..., description="Cosine similarity score (0.0 to 1.0) derived from retrieval")

class ChatResponse(BaseModel):
    answer: str = Field(..., description="Generated legal answer grounded on retrieved statutory context")
    chat_id: str = Field(..., description="Unique conversation session identifier")
    sources: List[SourceItem] = Field(default_factory=list, description="Retrieved source chunks with citations")
    model: Optional[str] = Field(default=None, description="LLM model used for synthesis")
    grounded: bool = Field(default=True, description="Whether answer is grounded on retrieved chunks")

# ============================================================================
# Document Management Schemas
# ============================================================================

class DocumentUploadResponse(BaseModel):
    document_id: str = Field(..., description="Generated unique UUID for the uploaded document")
    filename: str = Field(..., description="Sanitized original document filename")
    page_count: int = Field(..., description="Total extracted pages from the PDF")
    chunk_count: int = Field(..., description="Number of text chunks embedded and indexed in ChromaDB")
    file_size_bytes: int = Field(..., description="File size in bytes")
    status: str = Field(..., description="Processing status (e.g., indexed)")
    created_at: str = Field(..., description="ISO 8601 timestamp of indexing")

class DocumentSummary(BaseModel):
    document_id: str
    filename: str
    page_count: int
    chunk_count: int
    file_size: Optional[str] = None
    upload_date: Optional[str] = None

class DocumentDeleteResponse(BaseModel):
    document_id: str
    status: str
    deleted_chunks: int
    message: str

# ============================================================================
# Document Analysis Schemas
# ============================================================================

class ClauseItem(BaseModel):
    name: str
    type: str
    severity: str
    text: str
    commentary: str

class ObligationItem(BaseModel):
    party: str
    title: str
    description: str

class DeadlineItem(BaseModel):
    label: str
    date: str
    type: str

class RiskItem(BaseModel):
    level: str
    title: str
    description: str
    recommendation: str

class OverviewData(BaseModel):
    documentType: str
    governingLaw: str
    effectiveDate: str
    parties: List[dict]
    contractValue: str
    summary: str

class DocumentAnalysisResponse(BaseModel):
    document_id: Optional[str] = None
    fileName: str
    fileSize: str
    pageCount: int
    chunkCount: Optional[int] = None
    status: Optional[str] = "indexed"
    overview: OverviewData
    keyClauses: List[ClauseItem]
    obligations: List[ObligationItem]
    datesAndDeadlines: List[DeadlineItem]
    potentialRisks: List[RiskItem]
    lawyerQuestions: List[str]

# ============================================================================
# Library Schemas
# ============================================================================

class LibraryDocumentItem(BaseModel):
    document_id: str
    title: str
    category: str
    type: str
    total_chunks: int
    total_pages: int
    description: Optional[str] = None

class LibraryResponse(BaseModel):
    total_documents: int
    total_chunks: int
    documents: List[LibraryDocumentItem]

# ============================================================================
# Health Schemas
# ============================================================================

class HealthResponse(BaseModel):
    status: str = Field(..., description="Health status of the API", examples=["healthy"])
    application: str = Field(..., description="Application name", examples=["LegalMind AI"])
    embedding_model: Optional[str] = None
    indexed_chunks: Optional[int] = None
    deepseek_configured: Optional[bool] = None
