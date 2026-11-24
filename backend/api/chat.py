"""
LegalMind AI - Chat API Router
Handles conversational research queries, triggers RAG synthesis,
and returns evidence-grounded responses with statutory citations.
"""

from fastapi import APIRouter, HTTPException, Depends
from backend.schemas.request_models import ChatRequest, ChatResponse
from backend.generation.answer import get_answer_pipeline, RAGAnswerPipeline

router = APIRouter(prefix="/chat", tags=["Legal Research Chat"])

@router.post(
    "",
    response_model=ChatResponse,
    summary="Submit a legal inquiry",
    description="Embeds the query, retrieves grounded Indian legal provisions from ChromaDB, and generates an answer via DeepSeek."
)
async def submit_legal_query(
    request: ChatRequest,
    pipeline: RAGAnswerPipeline = Depends(get_answer_pipeline)
) -> ChatResponse:
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        response = await pipeline.answer_question(
            question=request.question.strip(),
            chat_id=request.chat_id
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while synthesizing legal analysis: {str(e)}"
        )
