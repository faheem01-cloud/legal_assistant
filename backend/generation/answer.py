"""
LegalMind AI - RAG Answer Generator
Coordinates semantic retrieval, prompt assembly, LLM generation,
and structured response formatting with verifiable citations.
"""

import uuid
from typing import Dict, Any, List
from backend.retrieval.retriever import get_retriever
from backend.generation.prompt import build_rag_messages
from backend.generation.llm import get_llm_client
from backend.schemas.request_models import ChatResponse, SourceItem

class RAGAnswerPipeline:
    """
    Orchestrates the complete Retrieval-Augmented Generation workflow.
    """

    def __init__(self):
        self.retriever = get_retriever()
        self.llm_client = get_llm_client()

    async def answer_question(
        self,
        question: str,
        chat_id: str = None
    ) -> ChatResponse:
        """
        Executes end-to-end RAG pipeline:
        User Question -> Embedding -> ChromaDB Retrieval -> DeepSeek LLM -> Sourced Answer.
        """
        session_id = chat_id or f"chat-{uuid.uuid4().hex[:10]}"

        # 1. Semantic retrieval from ChromaDB
        retrieved_chunks = self.retriever.retrieve(question)

        # 2. Build structured SourceItem list with genuine similarity scores
        sources: List[SourceItem] = []
        for c in retrieved_chunks:
            sources.append(SourceItem(
                document_id=c.get("document_id") or "doc-unknown",
                document_name=c.get("document_name") or "Indexed Act",
                page_number=c.get("page_number", 1),
                section=c.get("section"),
                text=c.get("text", "")[:400] + ("..." if len(c.get("text", "")) > 400 else ""),
                score=c.get("score", 0.0)
            ))

        # 3. Assemble messages for LLM
        messages = build_rag_messages(question, retrieved_chunks)

        # 4. Generate answer via DeepSeek API
        llm_result = await self.llm_client.generate(messages)

        if llm_result.get("content"):
            final_answer = llm_result["content"]
            model_name = llm_result.get("model", "deepseek-chat")
            grounded = len(sources) > 0
        else:
            # Fallback if API key is not configured or API is unreachable
            error_msg = llm_result.get("error", "LLM generation unavailable.")
            final_answer = self._generate_context_fallback(question, retrieved_chunks, error_msg)
            model_name = "context-synthesis-fallback"
            grounded = len(sources) > 0

        return ChatResponse(
            answer=final_answer,
            chat_id=session_id,
            sources=sources,
            model=model_name,
            grounded=grounded
        )

    def _generate_context_fallback(
        self,
        question: str,
        chunks: List[Dict[str, Any]],
        system_note: str
    ) -> str:
        """
        Generates an evidence-grounded summary directly from retrieved chunks
        when the DeepSeek API key is not yet configured in .env.
        """
        if not chunks:
            return (
                "### Short Answer\n"
                "No indexed legal documents or statutory provisions were found in the local database matching your inquiry.\n\n"
                "### Next Steps\n"
                "1. Upload relevant legal documents (e.g., The Indian Contract Act, Negotiable Instruments Act, or commercial agreements) via the `/api/documents/upload` endpoint.\n"
                "2. Configure `DEEPSEEK_API_KEY` in `backend/.env` to enable live LLM reasoning.\n\n"
                f"> **System Notice:** {system_note}\n\n"
                "### Disclaimer\n"
                "LegalMind AI is an informational technology research assistant, not an enrolled advocate. This response does not constitute legal representation."
            )

        provisions_summary = []
        for i, c in enumerate(chunks, 1):
            sec = f" ({c.get('section')})" if c.get('section') else ""
            act = f" [{c.get('act_name')}]" if c.get('act_name') else ""
            score = c.get('score', 0.0)
            provisions_summary.append(
                f"- **Passage {i}**{act}{sec} from `{c.get('document_name')}` (Page {c.get('page_number')}, Relevance: {score:.2f}):\n"
                f"  > \"{c['text'][:250].strip()}...\""
            )

        return (
            "### Short Answer\n"
            f"Based on {len(chunks)} retrieved passage(s) from the indexed Indian legal corpus, statutory references were identified relating to your query.\n\n"
            "### Retrieved Legal Evidence & Statutory Provisions\n"
            + "\n".join(provisions_summary) + "\n\n"
            "### Practical Next Steps\n"
            "1. Review the full statutory text in the source documents using the citation references above.\n"
            "2. Verify whether any recent legislative amendments or High Court/Supreme Court precedents apply.\n"
            "3. Consult a licensed advocate enrolled with the Bar Council of India for formal legal advice.\n\n"
            f"> **System Configuration Note:** {system_note}\n\n"
            "### Disclaimer\n"
            "LegalMind AI is an informational technology research assistant, not an enrolled advocate. This response does not constitute legal representation."
        )

def get_answer_pipeline() -> RAGAnswerPipeline:
    return RAGAnswerPipeline()
