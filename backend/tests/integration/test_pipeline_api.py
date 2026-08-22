import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["data"]["database_status"] == "HEALTHY"

@pytest.mark.asyncio
async def test_list_products_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/products")
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert len(json_data["data"]) >= 3

@pytest.mark.asyncio
async def test_dashboard_stats_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/dashboard/stats")
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["data"]["total_products"] >= 3

@pytest.mark.asyncio
async def test_process_text_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "text": "Swagelok 60 Series SS316 2-piece Ball Valve, rated for 40 bar pressure, -20°C to 180°C operating temperature. Standard ISO 5211 mounting.",
            "source_name": "API Test Ingestion"
        }
        response = await ac.post("/api/v1/products/process-text", json=payload)
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["data"]["job_id"] is not None

@pytest.mark.asyncio
async def test_product_lifecycle_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Get product list
        list_res = await ac.get("/api/v1/products")
        assert list_res.status_code == 200
        products = list_res.json()["data"]
        assert len(products) > 0
        product_id = products[0]["id"]

        # 2. Get product detail
        detail_res = await ac.get(f"/api/v1/products/{product_id}")
        assert detail_res.status_code == 200
        assert detail_res.json()["data"]["id"] == product_id

        # 3. Trigger Revalidation
        val_res = await ac.post(f"/api/v1/products/{product_id}/validate")
        assert val_res.status_code == 200
        assert val_res.json()["success"] is True

        # 4. Trigger Enrichment
        enrich_res = await ac.post(f"/api/v1/products/{product_id}/enrich")
        assert enrich_res.status_code == 200
        assert enrich_res.json()["success"] is True

        # 5. Get Evidence
        ev_res = await ac.get(f"/api/v1/products/{product_id}/evidence")
        assert ev_res.status_code == 200
        assert ev_res.json()["success"] is True

        # 6. Resolve conflict (if any conflict or test resolution)
        resolve_res = await ac.post(
            f"/api/v1/products/{product_id}/resolve-conflict",
            json={
                "attribute_name": "material",
                "selected_value": "SS316",
                "resolution_notes": "Verified by test engineer"
            }
        )
        assert resolve_res.status_code == 200
        assert resolve_res.json()["success"] is True

@pytest.mark.asyncio
async def test_catalog_export_json_and_csv():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        json_export = await ac.get("/api/v1/catalog/export?format=json")
        assert json_export.status_code == 200
        assert "application/json" in json_export.headers["content-type"]

        csv_export = await ac.get("/api/v1/catalog/export?format=csv")
        assert csv_export.status_code == 200
        assert "text/csv" in csv_export.headers["content-type"]

@pytest.mark.asyncio
async def test_upload_csv_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        csv_data = "sku,product_name,brand,category,material,thread_size\nHEX-CSV-01,Heavy Hex Bolt,Unbrako,Industrial Fasteners,SS316,M10\n"
        files = {"file": ("test_catalog.csv", csv_data.encode("utf-8"), "text/csv")}
        response = await ac.post("/api/v1/products/process", files=files)
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["data"]["source_type"] == "CSV"
        assert json_data["data"]["file_name"] == "test_catalog.csv"

@pytest.mark.asyncio
async def test_upload_txt_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        txt_data = "Product: SS316 Hex Bolt\nMaterial: SS316\nThread Size: M10\n"
        files = {"file": ("test_datasheet.txt", txt_data.encode("utf-8"), "text/plain")}
        response = await ac.post("/api/v1/products/process", files=files)
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["data"]["source_type"] == "TEXT"

@pytest.mark.asyncio
async def test_upload_pdf_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        pdf_data = b"%PDF-1.4 mock pdf content"
        files = {"file": ("test_datasheet.pdf", pdf_data, "application/pdf")}
        response = await ac.post("/api/v1/products/process", files=files)
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["data"]["source_type"] == "PDF"

@pytest.mark.asyncio
async def test_upload_unsupported_file_rejected():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        files = {"file": ("malicious.exe", b"binary content", "application/octet-stream")}
        response = await ac.post("/api/v1/products/process", files=files)
        assert response.status_code == 400
        json_data = response.json()
        assert json_data["success"] is False
        assert "Unsupported file type" in json_data["error"]["message"]

@pytest.mark.asyncio
async def test_csv_pipeline_async_multi_products():
    from app.services.processing_service import ProcessingService
    from app.db.database import AsyncSessionLocal

    csv_data = """sku,product_name,brand,category,material,thread_size,nominal_length
HEX-E2E-01,Heavy Hex Bolt M10,Unbrako,Industrial Fasteners,SS316,M10,50 mm
HEX-E2E-02,High-Tensile Hex Bolt M12,Unbrako,Industrial Fasteners,SS316,M12,60 mm
"""
    async with AsyncSessionLocal() as session:
        job = await ProcessingService.create_job(session, source_type="CSV", file_name="multi_bolt_catalog.csv")
        job_id = job.id

    await ProcessingService.run_pipeline_async(
        job_id=job_id,
        source_type="CSV",
        raw_text=csv_data,
        file_name="multi_bolt_catalog.csv"
    )

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        job_res = await ac.get(f"/api/v1/processing/jobs/{job_id}")
        assert job_res.status_code == 200
        job_data = job_res.json()["data"]
        assert job_data["status"] == "COMPLETED"
        assert job_data["product_id"] is not None

        # Verify product 1 is in database and detailed view works
        p1_res = await ac.get(f"/api/v1/products/{job_data['product_id']}")
        assert p1_res.status_code == 200
        p1_data = p1_res.json()["data"]
        assert p1_data["brand"] == "Unbrako"
        assert len(p1_data["attributes"]) > 0
        assert any(s["source_type"] == "CSV" for s in p1_data["sources"])


