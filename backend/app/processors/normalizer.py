import re
from typing import Tuple, Optional

class AttributeNormalizer:
    """
    Deterministic normalization for industrial product attributes:
    - Thread sizes (e.g. 'M10 x 50mm' -> thread_size: 'M10', length: '50 mm')
    - Pressure ratings ('16bar', '16 BAR', '1.6 MPa' -> normalized unit)
    - Temperature ranges ('-20C to 150C' -> standard format)
    - Standard materials (e.g. '316 SS', 'SUS316', 'AISI 316' -> 'SS316')
    """

    # Material standardizations
    MATERIAL_MAP = {
        r"(?i)\b(ss\s*316|316\s*ss|aisi\s*316|sus\s*316|stainless\s*steel\s*316|cf8m)\b": "SS316",
        r"(?i)\b(ss\s*304|304\s*ss|aisi\s*304|sus\s*304|stainless\s*steel\s*304)\b": "SS304",
        r"(?i)\b(high\s*chrome|high-chrome|chrome\s*iron|27%\s*cr)\b": "High-Chrome Alloy",
        r"(?i)\b(ptfe|teflon)\b": "PTFE",
        r"(?i)\b(monel\s*400)\b": "Monel 400",
        r"(?i)\b(hastelloy\s*c276)\b": "Hastelloy C276",
        r"(?i)\b(carbon\s*steel|cs|a105)\b": "Carbon Steel (ASTM A105)",
        r"(?i)\b(brass|c36000)\b": "Brass",
        r"(?i)\b(viton|fkm)\b": "FKM / Viton"
    }

    # Pressure unit standardizations
    PRESSURE_UNITS = {
        r"(?i)\bbar\b": "bar",
        r"(?i)\bpsi\b": "PSI",
        r"(?i)\bmpa\b": "MPa",
        r"(?i)\bkpa\b": "kPa"
    }

    # Dimension unit standardizations
    DIMENSION_UNITS = {
        r"(?i)\bmm\b": "mm",
        r"(?i)\bcm\b": "cm",
        r"(?i)\bm\b": "m",
        r"(?i)\binch(es)?|\b\"|''": "in"
    }

    @classmethod
    def normalize_material(cls, raw: str) -> str:
        if not raw:
            return raw
        for pattern, standard in cls.MATERIAL_MAP.items():
            if re.search(pattern, raw.strip()):
                return standard
        return raw.strip()

    @classmethod
    def normalize_thread_and_length(cls, text: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Parses composite string like 'M10 x 50mm' or 'M12-70' into (thread_size, length)
        """
        match = re.search(r"(?i)\b(M\d+(?:\.\d+)?)\b(?:\s*(?:[x×\*\-]\s*(\d+(?:\.\d+)?\s*(?:mm|cm|in)?)))?", text)
        thread = None
        length = None
        if match:
            thread = match.group(1).upper()
            raw_len = match.group(2)
            if raw_len:
                raw_len = raw_len.strip()
                unit_match = re.search(r"^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?$", raw_len)
                if unit_match:
                    num = unit_match.group(1)
                    unit = unit_match.group(2) or "mm"
                    length = f"{num} {unit}"

        # If length was not in composite, look for standalone length specification
        if not length:
            len_match = re.search(r"(?i)\b(?:nominal\s+)?length[:\s]+(\d+(?:\.\d+)?)\s*(mm|cm|m|in)\b", text)
            if len_match:
                length = f"{len_match.group(1)} {len_match.group(2)}"

        return thread, length

    @classmethod
    def normalize_unit_value(cls, text: str) -> Tuple[str, Optional[str]]:
        """
        Splits '16 bar', '240V', or '450 m3/h' into ('16', 'bar'), ('240', 'V'), or ('450', 'm3/h')
        """
        if not text:
            return "", None
        
        # Check standard pattern: number + unit (supports numbers, superscripts, and compound units)
        match = re.search(r"^\s*([+-]?\d+(?:\.\d+)?)\s*([a-zA-Z°%³²0-9]+(?:\/[a-zA-Z0-9]+)?)\s*$", text)
        if match:
            val = match.group(1)
            unit = match.group(2).strip()
            # Normalize unit
            for p, u in cls.PRESSURE_UNITS.items():
                if re.match(p, unit):
                    unit = u
                    break
            for p, u in cls.DIMENSION_UNITS.items():
                if re.match(p, unit):
                    unit = u
                    break
            return val, unit
        return text.strip(), None
