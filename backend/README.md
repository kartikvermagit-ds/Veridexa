# Veridexa Backend — AI-Powered Product Intelligence

**Team**: KAVRIX  
**Hackathon**: UniHack 2026  
**Core Motto**: *Extract. Validate. Enrich. Explain.*

---

## 1. Quickstart

### Prerequisites
- Python 3.11+
- Virtualenv or system Python

### Run Locally
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start development server (auto-seeds sample industrial catalog)
uvicorn app.main:app --reload --port 8000
```

The server will be live at `http://localhost:8000`.  
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

## 2. Running Automated Tests

```bash
pytest
```

---

## 3. Architecture Highlights

1. **Dual Validation Engine**: Combines deterministic unit, range, and format checks with AI semantic contradiction detection.
2. **5-Factor Mathematical Confidence Scoring**:
   $$C = w_e \cdot S_{evidence} + w_v \cdot S_{validation} + w_q \cdot S_{quality} + w_s \cdot S_{source} - P_{inferred}$$
3. **Traceability & Grounding**: Every extracted attribute links directly to exact source document coordinates, page numbers, and verbatim text quotes.
4. **Asynchronous Background Processing**: Resilient job lifecycle (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `EXTRACTING` $\rightarrow$ `VALIDATING` $\rightarrow$ `ENRICHING` $\rightarrow$ `COMPLETED`).
