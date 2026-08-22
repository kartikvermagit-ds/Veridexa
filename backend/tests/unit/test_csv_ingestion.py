import pytest
import io
import os
import tempfile
from app.processors.csv_processor import CSVProcessor

def test_csv_single_product_dynamic_columns():
    csv_content = """part_no,title,manufacturer,category,material,thread_size,nominal_length,standard
HEX-SS316-M12-60,Heavy Hex Bolt,Unbrako,Industrial Fasteners,SS316,M12,60 mm,DIN 933
"""
    products = CSVProcessor.parse_csv_content(csv_content)
    assert len(products) == 1
    p = products[0]
    assert p["sku"] == "HEX-SS316-M12-60"
    assert p["product_name"] == "Heavy Hex Bolt"
    assert p["brand"] == "Unbrako"
    assert p["category"] == "Industrial Fasteners"
    
    attr_map = {a["name"]: a["value"] for a in p["attributes"]}
    assert attr_map["material"] == "SS316"
    assert attr_map["standard"] == "DIN 933"
    assert "thread_size" in attr_map


def test_csv_multi_product_records():
    csv_content = """sku,product_name,brand,category,pressure_rating,temperature_range,seat_material
VLV-BV2-SS-40,2-Piece Ball Valve,Swagelok,Process Valves,40 bar,-20°C to 180°C,PTFE
VLV-BV3-SS-63,3-Piece High Pressure Valve,Parker,Process Valves,63 bar,-40°C to 200°C,FKM
PMP-SL-100,Industrial Slurry Pump,Grundfos,Fluid Handling,16 bar,-10°C to 90°C,High-Chrome
"""
    products = CSVProcessor.parse_csv_content(csv_content)
    assert len(products) == 3
    
    skus = [p["sku"] for p in products]
    assert skus == ["VLV-BV2-SS-40", "VLV-BV3-SS-63", "PMP-SL-100"]
    
    assert products[0]["brand"] == "Swagelok"
    assert products[1]["brand"] == "Parker"
    assert products[2]["brand"] == "Grundfos"


def test_csv_arbitrary_unseen_column_headers():
    csv_content = """Item_Code,Item_Headline,Vendor,Custom_Torque_Spec,Coating_Finish,Dielectric_Strength,Corrosion_Resistance
BOLT-CUSTOM-01,Precision Fastener,Apex Fasteners,85 Nm,Zinc Nickel Plating,15 kV/mm,1000h Salt Spray
"""
    products = CSVProcessor.parse_csv_content(csv_content)
    assert len(products) == 1
    p = products[0]
    assert p["sku"] == "BOLT-CUSTOM-01"
    assert p["product_name"] == "Precision Fastener"
    assert p["brand"] == "Apex Fasteners"
    
    attr_names = [a["name"] for a in p["attributes"]]
    assert "custom_torque_spec" in attr_names
    assert "coating_finish" in attr_names
    assert "dielectric_strength" in attr_names
    assert "corrosion_resistance" in attr_names


def test_csv_delimiters():
    # Semicolon delimited
    csv_semi = "part_num;model_name;vendor;pressure;voltage\nVALVE-99;Control Valve;Siemens;25 bar;24V\n"
    products_semi = CSVProcessor.parse_csv_content(csv_semi)
    assert len(products_semi) == 1
    assert products_semi[0]["sku"] == "VALVE-99"
    assert products_semi[0]["brand"] == "Siemens"

    # Tab delimited
    csv_tab = "sku\tname\tbrand\tflow\nPMP-01\tCentrifugal Pump\tFlowserve\t300 m3/h\n"
    products_tab = CSVProcessor.parse_csv_content(csv_tab)
    assert len(products_tab) == 1
    assert products_tab[0]["sku"] == "PMP-01"


def test_csv_utf8_bom_and_encodings():
    bom_content = "\ufeffsku,product_name,material\nBOLT-01,SS304 Bolt,Stainless Steel 304\n".encode("utf-8-sig")
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as f:
        f.write(bom_content)
        temp_path = f.name

    try:
        products = CSVProcessor.parse_file(temp_path)
        assert len(products) == 1
        assert products[0]["sku"] == "BOLT-01"
        assert products[0]["product_name"] == "SS304 Bolt"
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def test_csv_empty_or_whitespace_raises_error():
    with pytest.raises(ValueError, match="CSV file is empty"):
        CSVProcessor.parse_csv_content("")

    with pytest.raises(ValueError, match="CSV file is empty"):
        CSVProcessor.parse_csv_content("   \n\n  \t  ")


def test_csv_missing_headers_or_no_data():
    with pytest.raises(ValueError, match="CSV file contains headers but no product records"):
        CSVProcessor.parse_csv_content("sku,product_name,brand\n")

    with pytest.raises(ValueError, match="CSV file is missing a valid header row"):
        CSVProcessor.parse_csv_content(",,,,\n")


def test_csv_missing_core_fields_graceful_fallbacks():
    csv_content = """material,operating_pressure,max_temp
316 Stainless Steel,50 bar,200 °C
"""
    products = CSVProcessor.parse_csv_content(csv_content, category_hint="Process Valves")
    assert len(products) == 1
    p = products[0]
    assert p["sku"].startswith("KAV-")
    assert p["category"] == "Process Valves"
    assert len(p["attributes"]) >= 3
