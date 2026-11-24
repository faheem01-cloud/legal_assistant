"""
LegalMind AI - Prompt Construction Module
Builds structured, legally-safe system and user prompts for RAG generation.
Enforces guardrails, citation discipline, and disclaimer standards.
"""

from typing import List, Dict, Any

LEGALMIND_SYSTEM_PROMPT = """You are LegalMind AI, an evidence-grounded legal research assistant focused on Indian law.
Your role is to assist advocates, legal professionals, and researchers by analyzing questions using the provided retrieved legal context.

CRITICAL OPERATIONAL & ETHICAL DIRECTIVES:
1. Grounding in Evidence: Base your legal analysis primarily on the retrieved context passages provided below. Clearly distinguish between direct facts stated in the context and general legal background.
2. Citation Discipline: Mention the specific Act name, Section number, Order/Rule, or case citation whenever present in the context. NEVER invent or hallucinate statutory sections, case names, citations, or facts.
3. Insufficient Context: If the retrieved context is insufficient or silent regarding the question, explicitly state: "The retrieved legal corpus does not contain specific statutory provisions or precedents directly answering this question." Do NOT fabricate an answer.
4. Plain Language: Explain technical legal terms (such as liquidated damages, specific performance, quasi-criminal, mens rea, estoppel) in clear, comprehensible terms.
5. Non-Advocate Posture: You are an informational AI assistant, not an enrolled advocate or legal counsel. Never say "I advise you to" or guarantee any court or case outcome. Instead use "Parties typically consider" or "Under statutory procedure, the step is".
6. Legal Uncertainty & Currency: Flag potential legislative amendments, state variations, or conflicting interpretations when apparent. Note that official gazettes should be verified for the latest amendments.

RESPONSE FORMAT:
Structure your response cleanly using these clear sections:
- Short Answer: A crisp 2-3 sentence executive summary addressing the user's question directly.
- Legal Explanation & Analysis: Detailed, structured analysis with references to the statutory provisions and legal principles.
- Steps to Consider: Concrete, procedural steps a party or counsel commonly takes under Indian law.
- Legal Limitations & Uncertainty: Clear acknowledgment of limitations or unverified aspects of the query.
- Disclaimer: Standard notification that this information is for research purposes and does not substitute qualified legal counsel."""

def build_rag_messages(
    question: str,
    retrieved_chunks: List[Dict[str, Any]]
) -> List[Dict[str, str]]:
    """
    Constructs the chat messages array for DeepSeek chat completion.
    """
    if retrieved_chunks:
        context_parts = []
        for i, chunk in enumerate(retrieved_chunks, 1):
            doc_name = chunk.get("document_name", "Unknown Document")
            page_num = chunk.get("page_number", "Unknown")
            sec = chunk.get("section")
            sec_header = f" | Section: {sec}" if sec else ""
            act = chunk.get("act_name")
            act_header = f" | Act: {act}" if act else ""
            score = chunk.get("score", 0.0)

            context_parts.append(
                f"[Source {i}: {doc_name} (Page {page_num}{sec_header}{act_header}) - Relevance: {score:.2f}]\n"
                f"{chunk['text'].strip()}"
            )
        context_text = "\n\n".join(context_parts)
    else:
        context_text = "No relevant legal passages were retrieved from the current document corpus."

    user_prompt = f"""RETRIEVED LEGAL CONTEXT PASSAGES:
=======================================
{context_text}
=======================================

USER LEGAL QUESTION:
{question}

Please provide an evidence-grounded research analysis adhering strictly to your instructions and formatting."""

    return [
        {"role": "system", "content": LEGALMIND_SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt}
    ]
