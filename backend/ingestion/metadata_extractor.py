"""
LegalMind AI - Legal Metadata Extractor
Analyzes text chunks to extract statutory sections, Acts, and legal structures.
"""

import re
from typing import Dict, Any, Optional

# Regular expressions for common Indian legal citation patterns
SECTION_PATTERN = re.compile(
    r"\b(?:Section|Sec\.|Sec)\s+(\d+[A-Z]?(?:\(\d+\))*(?:\([a-z]\))*)\b",
    re.IGNORECASE
)
ARTICLE_PATTERN = re.compile(
    r"\bArticle\s+(\d+[A-Z]?(?:\(\d+\))*)\b",
    re.IGNORECASE
)
ORDER_RULE_PATTERN = re.compile(
    r"\bOrder\s+([IVXLCDM\d]+)\s+Rule\s+(\d+)\b",
    re.IGNORECASE
)
CHAPTER_PATTERN = re.compile(
    r"\bChapter\s+([IVXLCDM\d]+)\b",
    re.IGNORECASE
)

# Common Indian central acts and codes
KNOWN_ACTS = [
    ("Constitution of India", re.compile(r"Constitution of India", re.I)),
    ("The Indian Contract Act, 1872", re.compile(r"Indian Contract Act|Contract Act,\s*1872", re.I)),
    ("Negotiable Instruments Act, 1881", re.compile(r"Negotiable Instruments Act|NI Act", re.I)),
    ("Bharatiya Nyaya Sanhita, 2023", re.compile(r"Bharatiya Nyaya Sanhita|BNS", re.I)),
    ("Indian Penal Code, 1860", re.compile(r"Indian Penal Code|IPC", re.I)),
    ("Consumer Protection Act, 2019", re.compile(r"Consumer Protection Act", re.I)),
    ("Information Technology Act, 2000", re.compile(r"Information Technology Act|IT Act,?\s*2000", re.I)),
    ("Digital Personal Data Protection Act, 2023", re.compile(r"Digital Personal Data Protection|DPDP Act", re.I)),
    ("Arbitration and Conciliation Act, 1996", re.compile(r"Arbitration and Conciliation Act", re.I)),
    ("Specific Relief Act, 1963", re.compile(r"Specific Relief Act", re.I)),
    ("Transfer of Property Act, 1882", re.compile(r"Transfer of Property Act", re.I)),
    ("Code of Civil Procedure, 1908", re.compile(r"Code of Civil Procedure|CPC", re.I)),
]

def extract_legal_metadata(text: str, filename: str = "") -> Dict[str, Any]:
    """
    Scans legal chunk text and returns identified section, act, and structural tags.
    """
    metadata: Dict[str, Any] = {
        "section": None,
        "act_name": None,
        "chapter": None,
        "is_statutory": False
    }

    if not text:
        return metadata

    # 1. Section matching
    sec_match = SECTION_PATTERN.search(text)
    if sec_match:
        metadata["section"] = f"Section {sec_match.group(1)}"
        metadata["is_statutory"] = True
    else:
        art_match = ARTICLE_PATTERN.search(text)
        if art_match:
            metadata["section"] = f"Article {art_match.group(1)}"
            metadata["is_statutory"] = True
        else:
            ord_match = ORDER_RULE_PATTERN.search(text)
            if ord_match:
                metadata["section"] = f"Order {ord_match.group(1)} Rule {ord_match.group(2)}"
                metadata["is_statutory"] = True

    # 2. Chapter matching
    ch_match = CHAPTER_PATTERN.search(text)
    if ch_match:
        metadata["chapter"] = f"Chapter {ch_match.group(1)}"

    # 3. Act matching from text or filename
    full_context = f"{filename} {text}"
    for act_name, pattern in KNOWN_ACTS:
        if pattern.search(full_context):
            metadata["act_name"] = act_name
            break

    return metadata
