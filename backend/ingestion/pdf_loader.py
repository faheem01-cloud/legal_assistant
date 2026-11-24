"""
LegalMind AI - PDF Ingestion Module
Uses PyMuPDF (fitz) to reliably extract text page-by-page while preserving structural integrity.
"""

import uuid
from pathlib import Path
from typing import List, Dict, Any, Tuple
import fitz # PyMuPDF

class PDFExtractionError(Exception):
    """Raised when PDF text extraction fails or yields no meaningful text."""
    pass

class PDFLoader:
    """
    Handles PDF loading, validation, and structured page extraction.
    """

    @staticmethod
    def extract_pages_from_file(
        file_path: Path,
        original_filename: str,
        document_id: str = None
    ) -> Tuple[str, List[Dict[str, Any]], Dict[str, Any]]:
        """
        Extracts text from a PDF file page-by-page.

        Returns:
            document_id: Unique UUID identifier for the document
            pages: List of dictionaries with page_number, text, character_count
            metadata: Basic PDF metadata (title, author, total_pages)
        """
        doc_id = document_id or str(uuid.uuid4())

        if not file_path.exists():
            raise FileNotFoundError(f"PDF file not found at: {file_path}")

        try:
            doc = fitz.open(file_path)
        except Exception as e:
            raise PDFExtractionError(f"Failed to open PDF document: {str(e)}")

        total_pages = len(doc)
        if total_pages == 0:
            doc.close()
            raise PDFExtractionError("PDF document contains zero pages.")

        raw_meta = doc.metadata or {}
        extracted_pages: List[Dict[str, Any]] = []
        total_extracted_characters = 0

        for page_idx in range(total_pages):
            page_number = page_idx + 1
            page = doc[page_idx]

            # Extract clean utf-8 text
            text = page.get_text("text").strip()
            char_count = len(text)
            total_extracted_characters += char_count

            is_empty = char_count == 0

            extracted_pages.append({
                "document_id": doc_id,
                "document_name": original_filename,
                "page_number": page_number,
                "text": text,
                "character_count": char_count,
                "is_empty": is_empty
            })

        doc.close()

        # Quality check: ensure meaningful text was extracted
        # Scanned PDFs with no OCR typically yield very few or zero characters
        meaningful_pages = [p for p in extracted_pages if not p["is_empty"]]
        if total_extracted_characters < 40 or len(meaningful_pages) == 0:
            raise PDFExtractionError(
                f"No readable text could be extracted from '{original_filename}'. "
                "The file may be a scanned image or corrupted PDF without an OCR text layer."
            )

        document_metadata = {
            "title": raw_meta.get("title") or original_filename,
            "author": raw_meta.get("author") or "Unknown",
            "creator": raw_meta.get("creator") or "",
            "creation_date": raw_meta.get("creationDate") or "",
            "total_pages": total_pages,
            "readable_pages": len(meaningful_pages),
            "total_characters": total_extracted_characters
        }

        return doc_id, extracted_pages, document_metadata
