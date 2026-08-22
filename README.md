# VERIDEXA — AI-Powered Product Intelligence
### Developed by Team KAVRIX for UniHack 2026

> **Core Motto**: *Extract. Validate. Enrich. Explain.*  
> *"Don't just generate product data — prove why the data can be trusted."*

---

## 🚀 Overview purpose

**Veridexa** converts unstructured industrial product information (PDF datasheets, vendor tables, raw technical specs) into validated, grounded, and explainable product intelligence.

### Key Capabilities
1. **Multi-Format Extraction**: Ingests technical PDFs and raw spec text with exact coordinate and character offset mapping.
2. **Dual Validation Engine**: Deterministic SI unit & range checks + semantic cross-document conflict detection.
3. **5-Factor Grounded Confidence**: Multi-signal mathematical trust index calculating evidence substring matching, rule conformance, OCR clarity, and source authority.
4. **AI Domain Enrichment**: Synthesizes compatible applications, standards (DIN/ISO/ASTM), and environmental tolerances with transparent reasoning.
5. **Human-in-the-Loop Conflict Resolution**: Side-by-side discrepancy review rather than silent assumptions.

---

## 🛠️ Architecture

```
Veridexa/
├── backend/                  # FastAPI + SQLAlchemy 2.0 Async + Pydantic v2
│   ├── app/
│   │   ├── ai/               # LLM clients (OpenAI / Mock)
│   │   ├── api/v1/           # REST endpoints
│   │   ├── models/           # DB schema
│   │   ├── processors/       # PDF & text layout parsers
│   │   └── services/         # Validation, Confidence & Enrichment engines
│   └── tests/                # Pytest test suite (16 tests)
└── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── api/              # Centralized typed API client
        ├── components/       # Design system & visualizers
        └── pages/            # Dashboard, Process, Catalog, ProductDetail, Validation
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web App: `http://localhost:5173/`

---

## 🔑 Environment Configuration (`backend/.env`)

```env
PROJECT_NAME="Veridexa"
APP_NAME="Veridexa — AI-Powered Product Intelligence"
ENVIRONMENT="development"
DEBUG=True
API_V1_STR="/api/v1"
DATABASE_URL="sqlite+aiosqlite:///./veridexa.db"

# LLM Provider: "mock" (offline demo) or "openai"
LLM_PROVIDER="mock"
OPENAI_API_KEY=""
LLM_MODEL="gpt-4o-mini"
```
