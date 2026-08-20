from typing import Dict, Any, List
from app.models.product_attribute import OriginType

class ConfidenceService:
    """
    Computes transparent, multi-signal mathematical confidence score for industrial attributes:
    C = w_e * S_evidence + w_v * S_val + w_q * S_quality + w_s * S_source - P_inferred
    """

    # Weights
    W_EVIDENCE = 0.35
    W_VALIDATION = 0.25
    W_QUALITY = 0.20
    W_SOURCE = 0.20
    P_INFERRED_PENALTY = 0.15

    @classmethod
    def calculate_attribute_confidence(
        cls,
        origin_type: OriginType,
        has_exact_evidence: bool,
        is_validated: bool,
        is_ocr_clean: bool = True,
        is_oem_source: bool = True
    ) -> float:
        s_evidence = 1.0 if has_exact_evidence else 0.4
        s_validation = 1.0 if is_validated else 0.5
        s_quality = 1.0 if is_ocr_clean else 0.7
        s_source = 1.0 if is_oem_source else 0.8

        score = (
            cls.W_EVIDENCE * s_evidence +
            cls.W_VALIDATION * s_validation +
            cls.W_QUALITY * s_quality +
            cls.W_SOURCE * s_source
        )

        if origin_type == OriginType.INFERRED:
            score -= cls.P_INFERRED_PENALTY
        elif origin_type == OriginType.ENRICHED:
            score -= 0.05

        return round(max(0.1, min(0.99, score)), 2)

    @classmethod
    def calculate_product_metrics(
        cls,
        attributes: List[Dict[str, Any]],
        category: str
    ) -> Dict[str, Any]:
        """
        Calculates overall product confidence and category-specific completeness percentage.
        """
        if not attributes:
            return {"completeness": 0.0, "overall_confidence": 0.0, "missing_fields": []}

        # Expected core fields by category
        category_expectations = {
            "Industrial Fasteners": ["material", "thread_size", "length", "compliance_standard"],
            "Process Valves": ["material", "pressure_rating", "temperature_range", "compliance_standard"],
            "Fluid Handling": ["material", "pressure_rating", "flow_rate", "voltage"],
            "Sensors & Instrumentation": ["pressure_rating", "voltage", "output_signal", "accuracy"]
        }

        expected = category_expectations.get(category, ["material", "pressure_rating", "dimensions"])
        present_names = {a.get("name", "").lower() for a in attributes}
        
        missing = [f for f in expected if f not in present_names]
        completeness = round(max(0.0, (len(expected) - len(missing)) / len(expected)), 2)

        # Average confidence of extracted and enriched attributes
        conf_scores = [a.get("confidence", 0.8) for a in attributes]
        overall_confidence = round(sum(conf_scores) / len(conf_scores), 2) if conf_scores else 0.0

        return {
            "completeness": completeness,
            "overall_confidence": overall_confidence,
            "missing_fields": missing
        }
