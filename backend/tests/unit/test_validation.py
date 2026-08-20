from app.services.validation_service import ValidationService

def test_fastener_validation_pass():
    attrs = [
        {"name": "material", "value": "SS316"},
        {"name": "thread_size", "value": "M10"},
        {"name": "length", "value": "50 mm", "unit": "mm"}
    ]
    status, results, conflicts = ValidationService.validate_attributes("Industrial Fasteners", attrs)
    assert status == "VALIDATED"
    assert len(conflicts) == 0

def test_fastener_missing_material_anomaly():
    attrs = [
        {"name": "thread_size", "value": "M10"},
        {"name": "length", "value": "50 mm", "unit": "mm"}
    ]
    status, results, conflicts = ValidationService.validate_attributes("Industrial Fasteners", attrs)
    assert status == "ANOMALY"
    fail_results = [r for r in results if r["status"].value == "FAIL"]
    assert len(fail_results) > 0

def test_conflict_detection():
    attrs = [
        {"name": "material", "value": "SS316"},
        {"name": "pressure_rating", "value": "40 bar", "status": "CONFLICT"}
    ]
    status, results, conflicts = ValidationService.validate_attributes("Process Valves", attrs)
    assert status == "CONFLICT"
    assert len(conflicts) == 1
