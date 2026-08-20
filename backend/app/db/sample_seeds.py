import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.product import Product, ValidationStatus
from app.models.product_attribute import ProductAttribute, OriginType, AttributeStatus
from app.models.source import ProductSource, SourceType
from app.models.evidence import ProductEvidence
from app.models.validation import ValidationResult, RuleType, ValidationResultStatus
from app.models.enrichment import EnrichmentResult
from app.core.logging import logger

async def seed_sample_products(session: AsyncSession):
    # Check if database already has products
    check_query = select(Product).limit(1)
    existing = (await session.execute(check_query)).scalar_one_or_none()
    if existing:
        logger.info("Database already seeded with sample products. Skipping seed.")
        return

    logger.info("Seeding realistic industrial product dataset...")

    # -------------------------------------------------------------
    # PRODUCT 1: High-Tensile SS316 Hex Bolt (Fasteners)
    # -------------------------------------------------------------
    p1 = Product(
        id=str(uuid.uuid4()),
        sku="HEX-SS316-M10-50",
        product_name="High-Tensile SS316 Hex Bolt",
        brand="KAVRIX Fasteners",
        category="Industrial Fasteners",
        subcategory="Hex Head Cap Screws",
        description="High-strength marine-grade stainless steel hex head bolt engineered for corrosive chemical and offshore structural applications.",
        completeness=1.0,
        overall_confidence=0.97,
        validation_status=ValidationStatus.VALIDATED,
        raw_attributes={
            "material": "SS316",
            "thread_size": "M10",
            "length": "50 mm",
            "standard": "DIN 933 / ISO 4017",
            "tensile_strength": "800 MPa"
        }
    )
    s1 = ProductSource(
        id=str(uuid.uuid4()),
        product_id=p1.id,
        source_type=SourceType.PDF,
        file_name="Unbrako_SS316_Hex_Fasteners_Datasheet.pdf",
        checksum="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        raw_content="Unbrako SS316 Hex Head Cap Screw M10 x 50mm. Manufactured using premium SS316 stainless steel per DIN 933. Tensile strength >= 800 MPa."
    )
    p1.sources.append(s1)

    # Attributes
    a1_1 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p1.id,
        name="material",
        value="SS316",
        data_type="string",
        origin_type=OriginType.EXTRACTED,
        confidence=0.98,
        status=AttributeStatus.VALIDATED
    )
    a1_1.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a1_1.id,
            source_id=s1.id,
            page_number=1,
            snippet="Manufactured using premium SS316 stainless steel per DIN 933 specifications."
        )
    )

    a1_2 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p1.id,
        name="thread_size",
        value="M10",
        unit="metric",
        data_type="string",
        origin_type=OriginType.EXTRACTED,
        confidence=0.96,
        status=AttributeStatus.VALIDATED
    )
    a1_2.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a1_2.id,
            source_id=s1.id,
            page_number=1,
            snippet="Hex Head Cap Screw M10 x 50mm, coarse thread pitch 1.5mm."
        )
    )

    a1_3 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p1.id,
        name="length",
        value="50 mm",
        unit="mm",
        data_type="string",
        origin_type=OriginType.EXTRACTED,
        confidence=0.97,
        status=AttributeStatus.VALIDATED
    )
    a1_3.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a1_3.id,
            source_id=s1.id,
            page_number=1,
            snippet="Nominal length: 50 mm from underhead bearing surface to bolt end."
        )
    )

    a1_4 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p1.id,
        name="compliance_standard",
        value="DIN 933 / ISO 4017",
        data_type="string",
        origin_type=OriginType.EXTRACTED,
        confidence=0.99,
        status=AttributeStatus.VALIDATED
    )
    a1_4.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a1_4.id,
            source_id=s1.id,
            page_number=2,
            snippet="Standard dimensions conform to DIN 933 and ISO 4017 full-thread specifications."
        )
    )

    p1.attributes.extend([a1_1, a1_2, a1_3, a1_4])

    p1.validation_results.append(
        ValidationResult(
            product_id=p1.id,
            rule_name="DETERMINISTIC_UNIT_CONFORMANCE",
            rule_type=RuleType.DETERMINISTIC,
            status=ValidationResultStatus.PASS,
            field_name="length",
            message="Dimensions conform to SI standard millimeters (mm)."
        )
    )

    p1.enrichment_results.append(
        EnrichmentResult(
            product_id=p1.id,
            field_name="applications",
            enriched_value="Marine structural framing, chemical processing plants, food & beverage machinery, coastal architectural fasteners",
            enrichment_type=OriginType.ENRICHED,
            rationale="SS316 molybdenum alloy prevents pitting corrosion in chlorine and marine environments.",
            confidence=0.92
        )
    )
    p1.enrichment_results.append(
        EnrichmentResult(
            product_id=p1.id,
            field_name="recommended_torque",
            enriched_value="49 Nm (dry) / 37 Nm (lubricated)",
            enrichment_type=OriginType.INFERRED,
            rationale="Calculated for Grade A4-80 stainless steel M10 standard thread engagement.",
            confidence=0.88
        )
    )

    # -------------------------------------------------------------
    # PRODUCT 2: High-Pressure Ball Valve (Process Valves) - WITH CONFLICT DEMO
    # -------------------------------------------------------------
    p2 = Product(
        id=str(uuid.uuid4()),
        sku="VLV-BV2-SS316-PN40",
        product_name="2-Piece Stainless Steel Ball Valve",
        brand="Swagelok",
        category="Process Valves",
        subcategory="Quarter-Turn Valves",
        description="Full port 2-piece high-pressure stainless steel ball valve with PTFE seating for industrial fluid control.",
        completeness=0.88,
        overall_confidence=0.82,
        validation_status=ValidationStatus.CONFLICT,
        raw_attributes={
            "material": "SS316",
            "pressure_rating": "40 bar (Conflict: 63 bar in Distributor Catalog)",
            "temperature_range": "-20°C to 180°C"
        }
    )
    s2 = ProductSource(
        id=str(uuid.uuid4()),
        product_id=p2.id,
        source_type=SourceType.PDF,
        file_name="Swagelok_60_Series_Datasheet.pdf",
        raw_content="Swagelok 60 Series Ball Valve. Body: CF8M/SS316. Working Pressure: 40 bar at ambient temperature."
    )
    s2_dist = ProductSource(
        id=str(uuid.uuid4()),
        product_id=p2.id,
        source_type=SourceType.URL,
        source_url="https://distributor-catalog.example.com/valves/vlv-bv2",
        raw_content="Model VLV-BV2-SS316 rated for maximum 63 bar line pressure."
    )
    p2.sources.extend([s2, s2_dist])

    a2_1 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p2.id,
        name="material",
        value="SS316",
        origin_type=OriginType.EXTRACTED,
        confidence=0.98,
        status=AttributeStatus.VALIDATED
    )
    a2_1.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a2_1.id,
            source_id=s2.id,
            page_number=1,
            snippet="Body and ball precision cast in ASTM A351 Grade CF8M (SS316 equivalent)."
        )
    )

    a2_2 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p2.id,
        name="pressure_rating",
        value="40 bar",
        unit="bar",
        origin_type=OriginType.EXTRACTED,
        confidence=0.74,
        status=AttributeStatus.CONFLICT
    )
    a2_2.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a2_2.id,
            source_id=s2.id,
            page_number=2,
            snippet="Maximum allowable working pressure: 40 bar (PN40) at 20°C."
        )
    )
    a2_2.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a2_2.id,
            source_id=s2_dist.id,
            page_number=1,
            snippet="Distributor spec list indicates 63 bar maximum peak pressure rating."
        )
    )

    p2.attributes.extend([a2_1, a2_2])

    p2.validation_results.append(
        ValidationResult(
            product_id=p2.id,
            attribute_id=a2_2.id,
            rule_name="CROSS_DOCUMENT_CONFLICT_CHECK",
            rule_type=RuleType.AI_SEMANTIC,
            status=ValidationResultStatus.CONFLICT,
            field_name="pressure_rating",
            message="Contradiction detected: Manufacturer Datasheet specifies 40 bar (PN40) while Distributor catalog states 63 bar.",
            conflicting_data={
                "source_a": {"name": "Swagelok_60_Series_Datasheet.pdf", "value": "40 bar", "page": 2},
                "source_b": {"name": "Distributor URL Spec", "value": "63 bar", "url": "https://distributor-catalog.example.com"}
            }
        )
    )

    p2.enrichment_results.append(
        EnrichmentResult(
            product_id=p2.id,
            field_name="applications",
            enriched_value="Chemical isolation, petrochemical pipeline shutoff, high-pressure steam distribution",
            enrichment_type=OriginType.ENRICHED,
            rationale="PTFE seals combined with CF8M stainless body provide universal compatibility with aggressive media.",
            confidence=0.91
        )
    )

    # -------------------------------------------------------------
    # PRODUCT 3: Slurry Pump (Fluid Handling)
    # -------------------------------------------------------------
    p3 = Product(
        id=str(uuid.uuid4()),
        sku="PMP-CP-50HP-ANSI",
        product_name="Heavy-Duty Centrifugal Slurry Pump",
        brand="Grundfos",
        category="Fluid Handling",
        subcategory="Process Slurry Pumps",
        description="High-capacity centrifugal pump with open impeller designed for abrasive mineral slurries and heavy industrial tailings.",
        completeness=0.92,
        overall_confidence=0.94,
        validation_status=ValidationStatus.VALIDATED,
        raw_attributes={
            "material": "High-Chrome Alloy (27% Cr)",
            "flow_rate": "450 m3/h",
            "voltage": "460 V",
            "power": "50 HP"
        }
    )
    s3 = ProductSource(
        id=str(uuid.uuid4()),
        product_id=p3.id,
        source_type=SourceType.PDF,
        file_name="Grundfos_Slurry_Pumps_Specs.pdf",
        raw_content="Grundfos Heavy Slurry Model 100/75. High chrome alloy casing. Max flow: 450 m3/h at 1450 RPM. 50 HP 460V 3-phase motor."
    )
    p3.sources.append(s3)

    a3_1 = ProductAttribute(
        id=str(uuid.uuid4()),
        product_id=p3.id,
        name="material",
        value="High-Chrome Alloy",
        origin_type=OriginType.EXTRACTED,
        confidence=0.95,
        status=AttributeStatus.VALIDATED
    )
    a3_1.evidence.append(
        ProductEvidence(
            id=str(uuid.uuid4()),
            attribute_id=a3_1.id,
            source_id=s3.id,
            page_number=3,
            snippet="Impeller and casing cast from 27% High Chrome white iron with 650 HB hardness."
        )
    )
    p3.attributes.append(a3_1)

    p3.validation_results.append(
        ValidationResult(
            product_id=p3.id,
            rule_name="DETERMINISTIC_RANGE_CHECK",
            rule_type=RuleType.DETERMINISTIC,
            status=ValidationResultStatus.PASS,
            field_name="voltage",
            message="Voltage (460V) conforms to standard North American 3-phase industrial power."
        )
    )

    session.add_all([p1, p2, p3])
    await session.commit()
    logger.info("Successfully seeded 3 realistic industrial sample products!")
