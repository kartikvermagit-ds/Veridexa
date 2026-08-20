import os
from pypdf import PdfWriter

def create_sample_text_file(filepath: str, text: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(text)

def main():
    samples_dir = os.path.join(os.path.dirname(__file__), "..", "uploads", "samples")
    os.makedirs(samples_dir, exist_ok=True)

    # 1. Fastener Sample Datasheet Text
    fastener_text = """============================================================
UNBRAKO INDUSTRIAL FASTENERS - TECHNICAL SPECIFICATION SHEET
============================================================
Product: High-Tensile Hexagon Head Cap Screw
Model Series: ISO 4017 / DIN 933 Metric Fasteners
SKU / Part Number: HEX-SS316-M10-50
Brand: Unbrako Industrial

1. MATERIAL SPECIFICATION:
   - Material Grade: Premium SS316 Stainless Steel (A4-80)
   - Corrosion Resistance: High pitting resistance (PREN > 24)
   - Tensile Strength: >= 800 MPa minimum

2. DIMENSIONAL ATTRIBUTES:
   - Thread Size: M10 (Metric coarse pitch 1.5mm)
   - Nominal Length: 50 mm
   - Head Type: Standard Hexagon Head (16mm Across Flats)
   - Threading: Full Thread per DIN 933

3. OPERATING PARAMETERS & COMPLIANCE:
   - Temperature Range: -196°C to +400°C
   - Compliance Standard: DIN 933 / ISO 4017 / RoHS Compliant
   - Recommended Tightening Torque: 49 Nm
"""
    create_sample_text_file(os.path.join(samples_dir, "SS316_Hex_Bolt_Datasheet.txt"), fastener_text)

    # 2. Process Valve Sample Datasheet Text
    valve_text = """============================================================
SWAGELOK PROCESS CONTROLS - 60 SERIES BALL VALVE
============================================================
Product Name: 2-Piece Stainless Steel Ball Valve
Part Number: VLV-BV2-SS316-PN40
Brand: Swagelok

1. TECHNICAL ATTRIBUTES:
   - Body Material: ASTM A351 Grade CF8M (SS316)
   - Seat Material: Reinforced PTFE (Teflon)
   - Pressure Rating: 40 bar (PN40) at ambient temperature (20°C)
   - Port Diameter: Full bore 25 mm (1 inch)
   - Temperature Range: -20°C to 180°C

2. ACTUATION & MOUNTING:
   - Operation: Quarter-turn manual lever with locking latch
   - Top Mounting Flange: ISO 5211 direct mounting pad
   - End Connections: Female NPT threaded ports
"""
    create_sample_text_file(os.path.join(samples_dir, "High_Pressure_Ball_Valve_Datasheet.txt"), valve_text)

    # 3. Slurry Pump Sample Datasheet Text
    pump_text = """============================================================
GRUNDFOS INDUSTRIAL - CENTRIFUGAL SLURRY PUMP
============================================================
Product Name: Heavy-Duty Industrial Centrifugal Slurry Pump
Part Number: PMP-CP-50HP-ANSI
Brand: Grundfos

1. OPERATING PARAMETERS:
   - Maximum Flow Rate: 450 m3/h
   - Discharge Pressure: 16 bar
   - Motor Power: 50 HP (37 kW)
   - Voltage: 460 V 3-Phase 60Hz
   - Casing Material: 27% High Chrome White Iron (650 HB)
   - Impeller Type: 4-Vane Semi-Open Slurry Impeller
"""
    create_sample_text_file(os.path.join(samples_dir, "Slurry_Pump_Technical_Specs.txt"), pump_text)

    print(f"Sample datasheets generated in {os.path.abspath(samples_dir)}")

if __name__ == "__main__":
    main()
