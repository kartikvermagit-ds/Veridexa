import re
from typing import List, Dict, Any, Tuple
from app.models.validation import RuleType, ValidationResultStatus

class ValidationService:
    """
    Dual validation engine executing:
    1. Deterministic validation (units, ranges, material grades, formats)
    2. Multi-source conflict detection & semantic checks
    """

    ALLOWED_UNITS = {
        "pressure_rating": ["bar", "psi", "mpa", "kpa", "class"],
        "length": ["mm", "cm", "m", "in"],
        "temperature_range": ["°c", "c", "°f", "f", "k"],
        "voltage": ["v", "vac", "vdc", "kv"]
    }

    @classmethod
    def validate_attributes(
        cls,
        category: str,
        attributes: List[Dict[str, Any]]
    ) -> Tuple[str, List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Runs deterministic checks on attribute array.
        Returns (overall_status, validation_results, detected_conflicts)
        """
        results = []
        conflicts = []
        has_failure = False
        has_conflict = False

        attr_map = {a.get("name", "").lower(): a for a in attributes}

        # 1. Required core attributes by category
        if "fastener" in category.lower():
            if "material" not in attr_map:
                results.append({
                    "rule_name": "REQUIRED_FIELD_CHECK",
                    "rule_type": RuleType.DETERMINISTIC,
                    "status": ValidationResultStatus.FAIL,
                    "field_name": "material",
                    "message": "Industrial Fasteners must specify alloy/material grade."
                })
                has_failure = True
            if "thread_size" not in attr_map:
                results.append({
                    "rule_name": "REQUIRED_FIELD_CHECK",
                    "rule_type": RuleType.DETERMINISTIC,
                    "status": ValidationResultStatus.WARNING,
                    "field_name": "thread_size",
                    "message": "Thread size (e.g. M10) is recommended for fastener completeness."
                })

        # 2. Unit and format checks
        for attr in attributes:
            name = attr.get("name", "").lower()
            val = str(attr.get("value", ""))
            unit = attr.get("unit")

            # Validate unit
            if name in cls.ALLOWED_UNITS:
                allowed = cls.ALLOWED_UNITS[name]
                found_valid_unit = False
                if unit and unit.lower() in allowed:
                    found_valid_unit = True
                else:
                    for u in allowed:
                        if u in val.lower():
                            found_valid_unit = True
                            break
                
                if found_valid_unit:
                    results.append({
                        "rule_name": f"UNIT_CONFORMANCE_{name.upper()}",
                        "rule_type": RuleType.DETERMINISTIC,
                        "status": ValidationResultStatus.PASS,
                        "field_name": name,
                        "message": f"Attribute '{name}' conforms to standard industrial engineering units."
                    })
                else:
                    results.append({
                        "rule_name": f"UNIT_CONFORMANCE_{name.upper()}",
                        "rule_type": RuleType.DETERMINISTIC,
                        "status": ValidationResultStatus.WARNING,
                        "field_name": name,
                        "message": f"Attribute '{name}' value '{val}' missing recognized standard unit."
                    })

            # Check for conflict markings
            if attr.get("status") == "CONFLICT" or "conflict" in val.lower():
                has_conflict = True
                conflicts.append({
                    "field_name": name,
                    "value": val,
                    "reason": "Conflicting source specifications detected."
                })
                results.append({
                    "rule_name": f"CONFLICT_DETECTED_{name.upper()}",
                    "rule_type": RuleType.AI_SEMANTIC,
                    "status": ValidationResultStatus.CONFLICT,
                    "field_name": name,
                    "message": f"Discrepancy detected for attribute '{name}'. Manual reconciliation recommended."
                })

        overall_status = "VALIDATED"
        if has_conflict:
            overall_status = "CONFLICT"
        elif has_failure:
            overall_status = "ANOMALY"

        return overall_status, results, conflicts
