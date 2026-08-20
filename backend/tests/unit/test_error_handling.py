import pytest
import os
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.processors.pdf_processor import PDFProcessor
from app.core.exceptions import NotFoundException, IngestionException

def test_missing_pdf_file_raises_error():
    with pytest.raises(FileNotFoundError):
        PDFProcessor.extract_pages("non_existent_file_12345.pdf")

@pytest.mark.asyncio
async def test_not_found_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/products/non-existent-uuid-999")
        assert response.status_code == 404
        json_data = response.json()
        assert json_data["success"] is False
        assert json_data["error"]["code"] == "NOT_FOUND"

@pytest.mark.asyncio
async def test_empty_process_request():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/products/process")
        assert response.status_code == 400
        json_data = response.json()
        assert json_data["success"] is False
        assert json_data["error"]["code"] == "INGESTION_ERROR"
