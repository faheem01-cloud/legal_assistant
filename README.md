# LegalMind AI — Premium AI Legal Research Platform

**LegalMind AI** is an AI-powered legal research and document intelligence platform focused on Indian law. Built with a bespoke design system inspired by top legal-tech SaaS platforms (Harvey, CoCounsel, LexisNexis AI), LegalMind AI provides evidence-grounded statutory analysis, citation retrieval, and contract risk auditing.

---

## 📁 Project Architecture

The project is cleanly separated into two standalone, decoupled services:

```text
LegalMind_Assistant/
├── frontend/                   # React 19 + Vite 8 frontend client
│   ├── src/                    # Components, pages, context, and styling
│   ├── public/                 # Favicon and statqic web assets
│   ├── package.json            # Frontend dependencies & scripts
│   ├── package-lock.json       # Lockfile
│   ├── vite.config.js          # Vite development & build config
│   ├── index.html              # Single page entry point
│   └── .env.example            # Frontend environment template
├── backend/                    # Python FastAPI + RAG backend
│   ├── main.py                 # FastAPI application & router mounting
│   ├── config.py               # Backend configuration & environment
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # DeepSeek & server configuration template
│   ├── api/                    # Chat, documents, and library routers
│   ├── ingestion/              # PyMuPDF parser & legal-aware chunker
│   ├── embeddings/             # Sentence Transformers (all-MiniLM-L6-v2)
│   ├── vector_store/           # Persistent ChromaDB store
│   ├── retrieval/              # SemanticRetriever engine
│   ├── generation/             # Prompt engineering & DeepSeek client
│   ├── schemas/                # Pydantic validation models
│   ├── tests/                  # 14 Pytest test cases (100% pass)
│   └── data/                   # ChromaDB and uploaded PDFs
├── README.md                   # Project documentation
└── .gitignore                  # Git exclusions for both services
```

---

## 🚀 Running the Project

### 1. Running the Frontend (React + Vite)

Open a terminal and navigate to `frontend/`:
```powershell
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Running the Backend (Python FastAPI)

Open a second terminal and navigate to the project root:
```powershell
# Activate the virtual environment
backend\venv\Scripts\activate

# Start the FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API documentation: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.

### 3. Running Backend Tests

```powershell
backend\venv\Scripts\pytest backend\tests -v
```

---

## 🌟 Key Features

### 1. Legal Assistant (Evidence-Grounded Conversational AI)
- **Executive Short Answers**: Crisp, high-level legal syntheses for rapid evaluation.
- **In-Depth Legal Analysis**: Thorough statutory interpretation, legislative history, and doctrinal context.
- **Relevant Statutory Provisions**: Key sections mapped with section badges (e.g., Section 73 Indian Contract Act, Section 138 NI Act, Section 35 Consumer Protection Act).
- **Counsel / Client Action Checklist**: Step-by-step actionable recommendations.
- **Interactive Citations Panel**: Collapsible drawer showing source documents, relevance match scores, and extracted passages.
- **Full Statute Modal Viewer**: Deep-dive popup for examining full statutory texts and judicial precedents.

### 2. Document Intelligence & Contract Review
- **Drag-and-Drop Upload**: Supports PDF, DOCX, and TXT files with client-side file inspection.
- **Preset Sample Agreements**: Instantly load and test analysis on realistic contracts:
  - Enterprise Cloud Services Agreement (SaaS)
  - Commercial Office Lease Deed (Bengaluru)
  - Section 138 Statutory Cheque Dishonour Demand Notice
- **Comprehensive Audit Structure**:
  - Document Overview (Governing Law, Jurisdiction, Commercial Value, Parties)
  - Key Contractual Clauses Audit (Liability caps, Asymmetrical termination, IP ownership, Arbitration venue)
  - Key Contractual Obligations (SLAs, payment terms, statutory DPDP Act compliance)
  - Critical Dates & Deadlines timeline
  - Potential Legal Risks & Exposures (High, Medium, Low risk badges with actionable recommendations)
  - Targeted Inquiries to Ask Your Advocate
  - Export Audit Report functionality

### 3. Indian Legal Knowledge Library
- **Statutes & Codes**:
  - The Constitution of India, 1950
  - The Indian Contract Act, 1872
  - Bharatiya Nyaya Sanhita, 2023 (BNS)
  - The Negotiable Instruments Act, 1881
  - Consumer Protection Act, 2019
  - Information Technology Act, 2000
  - Digital Personal Data Protection Act, 2023 (DPDP)
  - Arbitration and Conciliation Act, 1996
  - Landmark Supreme Court of India Precedents
- **Real-time Filter & Search**: Search by keywords, sections, and category filters.
- **Act Exploration Modal**: Drill down into specific sections and dispatch research queries directly to the assistant.

### 4. Research History & Audit Trail
- Browser `localStorage` persistence for research sessions.
- Categorized by legal domains (Contract Law, Banking & NI Act, Consumer Protection, Cyber Law, Property).
- Seamless resumption: Clicking any session loads the complete query, response, and citations back into the workspace.
- Individual session deletion and new research reset.

### 5. Legal Safety & Regulatory Compliance
- Embedded disclaimers adhering to the Advocates Act, 1961 and legal information standards.
- Clear demarcation that LegalMind AI is an informational technology assistant, not a law firm.

---

## 🎨 Design System

- **Primary Colors**: Deep Navy (`#0A1128`, `#060B17`), Warm Light Surface (`#F7F8FA`, `#FFFFFF`).
- **Accents**: Muted Brass / Gold (`#C5A059`, `#B38E46`, `#D8B776`).
- **Typography**: Plus Jakarta Sans (interface), Cormorant Garamond (distinguished headings), JetBrains Mono (statutory sections).
- **Custom CSS**: Pure, modular CSS without external styling frameworks or Tailwind clutter.
