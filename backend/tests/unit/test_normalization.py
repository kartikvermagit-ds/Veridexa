from app.processors.normalizer import AttributeNormalizer

def test_material_normalization():
    assert AttributeNormalizer.normalize_material("316 SS Grade") == "SS316"
    assert AttributeNormalizer.normalize_material("SUS 304") == "SS304"
    assert AttributeNormalizer.normalize_material("Teflon lining") == "PTFE"
    assert AttributeNormalizer.normalize_material("Monel 400 alloy") == "Monel 400"
    assert AttributeNormalizer.normalize_material("27% High Chrome White Iron") == "High-Chrome Alloy"

def test_thread_and_length_normalization():
    thread, length = AttributeNormalizer.normalize_thread_and_length("M10 x 50mm")
    assert thread == "M10"
    assert length == "50 mm"

    thread2, length2 = AttributeNormalizer.normalize_thread_and_length("M12-70")
    assert thread2 == "M12"
    assert length2 == "70 mm"

    thread3, length3 = AttributeNormalizer.normalize_thread_and_length("Thread: M10\nNominal Length: 50 mm")
    assert thread3 == "M10"
    assert length3 == "50 mm"

def test_unit_value_normalization():
    val, unit = AttributeNormalizer.normalize_unit_value("16 BAR")
    assert val == "16"
    assert unit == "bar"

    val2, unit2 = AttributeNormalizer.normalize_unit_value("240V")
    assert val2 == "240"
    assert unit2 == "V"

    val3, unit3 = AttributeNormalizer.normalize_unit_value("450 m3/h")
    assert val3 == "450"
    assert unit3 == "m3/h"
