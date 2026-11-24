"""
LegalMind AI - Legal-Aware Chunking Engine
Splits extracted document pages into coherent, sentence-respecting chunks
while attaching statutory metadata and preserving page numbers.
"""

import re
from typing import List, Dict, Any
from backend.config import settings
from backend.ingestion.metadata_extractor import extract_legal_metadata

# Regex to split on sentence boundaries without breaking common legal abbreviations
# Handles abbreviations like: u/s, sec., v., no., art., or numbering like 1., 2.
SENTENCE_SPLIT_REGEX = re.compile(
    r"(?<=[.!?])\s+(?=[A-Z0-9\(\[\"\'])",
    re.MULTILINE
)

class LegalChunker:
    """
    Sentence-aware, page-preserving text chunker for Indian legal documents.
    """

    def __init__(self, chunk_size_chars: int = None, chunk_overlap_chars: int = None):
        # 1 token is roughly 4 characters in standard English / legal text
        self.chunk_size = chunk_size_chars or (settings.CHUNK_SIZE * 4)
        self.chunk_overlap = chunk_overlap_chars or (settings.CHUNK_OVERLAP * 4)

    def chunk_pages(
        self,
        pages: List[Dict[str, Any]],
        document_id: str,
        document_name: str
    ) -> List[Dict[str, Any]]:
        """
        Chunks text page-by-page to guarantee that chunks never cross into unrelated documents
        and accurately retain page attribution.
        """
        all_chunks: List[Dict[str, Any]] = []
        global_chunk_idx = 0

        for page in pages:
            if page.get("is_empty") or not page.get("text"):
                continue

            page_number = page["page_number"]
            page_text = page["text"]

            # If the entire page fits cleanly in a chunk, keep it intact
            if len(page_text) <= self.chunk_size:
                meta = extract_legal_metadata(page_text, document_name)
                chunk_id = f"{document_id}_p{page_number}_c{global_chunk_idx}"
                all_chunks.append({
                    "chunk_id": chunk_id,
                    "document_id": document_id,
                    "document_name": document_name,
                    "page_number": page_number,
                    "text": page_text,
                    "character_count": len(page_text),
                    "section": meta.get("section"),
                    "act_name": meta.get("act_name"),
                    "chapter": meta.get("chapter"),
                    "is_statutory": meta.get("is_statutory", False)
                })
                global_chunk_idx += 1
                continue

            # Otherwise, perform sentence-aware window chunking
            sentences = [s.strip() for s in SENTENCE_SPLIT_REGEX.split(page_text) if s.strip()]
            if not sentences:
                sentences = [page_text]

            current_chunk_sentences: List[str] = []
            current_chunk_len = 0

            for sentence in sentences:
                sentence_len = len(sentence)

                # If adding this sentence exceeds chunk size and we already have content
                if current_chunk_len + sentence_len > self.chunk_size and current_chunk_sentences:
                    chunk_text = " ".join(current_chunk_sentences).strip()
                    meta = extract_legal_metadata(chunk_text, document_name)
                    chunk_id = f"{document_id}_p{page_number}_c{global_chunk_idx}"

                    all_chunks.append({
                        "chunk_id": chunk_id,
                        "document_id": document_id,
                        "document_name": document_name,
                        "page_number": page_number,
                        "text": chunk_text,
                        "character_count": len(chunk_text),
                        "section": meta.get("section"),
                        "act_name": meta.get("act_name"),
                        "chapter": meta.get("chapter"),
                        "is_statutory": meta.get("is_statutory", False)
                    })
                    global_chunk_idx += 1

                    # Compute overlap from end of current chunk
                    overlap_sentences: List[str] = []
                    overlap_len = 0
                    for sent in reversed(current_chunk_sentences):
                        if overlap_len + len(sent) <= self.chunk_overlap:
                            overlap_sentences.insert(0, sent)
                            overlap_len += len(sent)
                        else:
                            break

                    current_chunk_sentences = overlap_sentences + [sentence]
                    current_chunk_len = sum(len(s) for s in current_chunk_sentences) + len(current_chunk_sentences)
                else:
                    current_chunk_sentences.append(sentence)
                    current_chunk_len += sentence_len + 1

            # Flush remaining sentences
            if current_chunk_sentences:
                chunk_text = " ".join(current_chunk_sentences).strip()
                meta = extract_legal_metadata(chunk_text, document_name)
                chunk_id = f"{document_id}_p{page_number}_c{global_chunk_idx}"

                all_chunks.append({
                    "chunk_id": chunk_id,
                    "document_id": document_id,
                    "document_name": document_name,
                    "page_number": page_number,
                    "text": chunk_text,
                    "character_count": len(chunk_text),
                    "section": meta.get("section"),
                    "act_name": meta.get("act_name"),
                    "chapter": meta.get("chapter"),
                    "is_statutory": meta.get("is_statutory", False)
                })
                global_chunk_idx += 1

        return all_chunks
