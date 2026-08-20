from app.services.confidence_service import ConfidenceService
from app.models.product_attribute import OriginType

def test_extracted_attribute_confidence():
    conf = ConfidenceService.calculate_attribute_confidence(
        origin_type=OriginType.EXTRACTED,
        has_exact_evidence=True,
        is_validated=True,
        is_ocr_clean=True,
        is_oem_source=True
    )
    assert conf >= 0.95

def test_inferred_attribute_penalty():
    conf_ext = ConfidenceService.calculate_attribute_confidence(
        origin_type=OriginType.EXTRACTED,
        has_exact_evidence=True,
        is_validated=True
    )
    conf_inf = ConfidenceService.calculate_attribute_confidence(
        origin_type=OriginType.INFERRED,
        has_exact_evidence=True,
        is_validated=True
    )
    assert conf_inf < conf_ext
    assert conf_inf >= 0.70

def test_product_metrics_completeness():
    attrs = [
        {"name": "material", "value": "SS316", "confidence": 0.98},
        {"name": "thread_size", "value": "M10", "confidence": 0.96},
        {"name": "length", "value": "50 mm", "confidence": 0.95},
        {"name": "compliance_standard", "value": "DIN 933", "confidence": 0.99}
    ]
    metrics = ConfidenceService.calculate_product_metrics(attrs, "Industrial Fasteners")
    assert metrics["completeness"] == 1.0
    assert metrics["overall_confidence"] >= 0.95
    assert len(metrics["missing_fields"]) == 0
