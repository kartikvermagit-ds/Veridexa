import os
import json
import re
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import AIProviderException
from app.processors.normalizer import AttributeNormalizer
from app.processors.text_processor import TextProcessor

class BaseLLMClient(ABC):
    @abstractmethod
    async def extract_product(self, text: str, category_hint: Optional[str] = None) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def validate_product(self, product_dict: Dict[str, Any], source_text: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def enrich_product(self, product_dict: Dict[str, Any]) -> Dict[str, Any]:
        pass


class LocalMockLLMClient(BaseLLMClient):
    """
    Deterministic domain-aware AI engine designed for offline demos, reliable testing,
    and fallback execution. Accurately extracts industrial attributes, links evidence snippets,
    detects anomalies, and generates domain enrichments.
    """

    async def extract_product(self, text: str, category_hint: Optional[str] = None) -> Dict[str, Any]:
        logger.info("Executing LocalMockLLMClient extraction engine...")
        cleaned = TextProcessor.clean_text(text)
        lower_text = cleaned.lower()
        
        # 1. Product Name & Category classification
        product_name = "Industrial Component"
        category = category_hint or "Industrial Equipment"
        subcategory = "General"
        brand = "KAVRIX Industrial"
        sku = f"KAV-{abs(hash(cleaned)) % 90000 + 10000}"

        if "bolt" in lower_text or "fastener" in lower_text or "screw" in lower_text or "nut" in lower_text:
            category = "Industrial Fasteners"
            subcategory = "Hex Head Fasteners"
            product_name = "Industrial Hex Head Cap Screw"
            if "ss316" in lower_text or "316" in lower_text:
                product_name = "High-Tensile SS316 Hex Bolt"
                sku = "HEX-SS316-M10-50"
        elif "valve" in lower_text or "ball valve" in lower_text:
            category = "Process Valves"
            subcategory = "Ball Valves"
            product_name = "High-Pressure 2-Piece Stainless Ball Valve"
            sku = "VLV-BV2-SS316-PN40"
        elif "pump" in lower_text or "impeller" in lower_text:
            category = "Fluid Handling"
            subcategory = "Centrifugal Pumps"
            product_name = "Industrial Centrifugal Slurry Pump"
            sku = "PMP-CP-50HP-ANSI"
        elif "sensor" in lower_text or "transducer" in lower_text or "pressure" in lower_text:
            category = "Sensors & Instrumentation"
            subcategory = "Pressure Transmitters"
            product_name = "Piezoresistive Industrial Pressure Transmitter"
            sku = "TX-PZ-420MA-100BAR"

        # Check for brand in text
        for b in ["Swagelok", "Parker", "Unbrako", "Grundfos", "Danfoss", "WIKA", "Siemens", "Emerson"]:
            if b.lower() in lower_text:
                brand = b
                break

        # Check for explicit SKU in text
        sku_match = re.search(r"(?i)\b(?:part\s*(?:no|number|#)?|sku|model)[:\s]+([A-Za-z0-9\-\.\/]{4,25})\b", cleaned)
        if sku_match:
            sku = sku_match.group(1).strip()

        # 2. Extract Attributes with Evidence
        attributes = []

        # Material
        mat_norm = AttributeNormalizer.normalize_material(cleaned)
        if mat_norm and mat_norm.lower() in lower_text:
            ev = TextProcessor.find_evidence_snippet(cleaned, mat_norm)
            attributes.append({
                "name": "material",
                "value": mat_norm,
                "unit": None,
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Material specified as {mat_norm}",
                "confidence": 0.98
            })

        # Thread size & Length
        thread, length = AttributeNormalizer.normalize_thread_and_length(cleaned)
        if thread:
            ev = TextProcessor.find_evidence_snippet(cleaned, thread)
            attributes.append({
                "name": "thread_size",
                "value": thread,
                "unit": "metric",
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Thread: {thread}",
                "confidence": 0.96
            })
        if length:
            ev = TextProcessor.find_evidence_snippet(cleaned, length.replace(" mm", ""))
            attributes.append({
                "name": "length",
                "value": length,
                "unit": "mm",
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Length: {length}",
                "confidence": 0.95
            })

        # Pressure Rating
        pressure_match = re.search(r"(?i)(\d+(?:\.\d+)?)\s*(bar|psi|mpa|kpa|class\s*\d+)", cleaned)
        if pressure_match:
            pval = f"{pressure_match.group(1)} {pressure_match.group(2)}"
            ev = TextProcessor.find_evidence_snippet(cleaned, pressure_match.group(0))
            attributes.append({
                "name": "pressure_rating",
                "value": pval,
                "unit": pressure_match.group(2),
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Rated pressure: {pval}",
                "confidence": 0.94
            })

        # Temperature Range
        temp_match = re.search(r"(?i)(-?\d+\s*(?:°C|C)?\s*(?:to|-)\s*\+?\d+\s*°C)", cleaned)
        if temp_match:
            tval = temp_match.group(1)
            ev = TextProcessor.find_evidence_snippet(cleaned, tval)
            attributes.append({
                "name": "temperature_range",
                "value": tval,
                "unit": "°C",
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Operating temperature: {tval}",
                "confidence": 0.93
            })

        # Voltage / Electrical
        volt_match = re.search(r"(?i)\b(\d{2,4}\s*(?:V|VAC|VDC))\b", cleaned)
        if volt_match:
            vval = volt_match.group(1)
            ev = TextProcessor.find_evidence_snippet(cleaned, vval)
            attributes.append({
                "name": "voltage",
                "value": vval,
                "unit": "V",
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Voltage specification: {vval}",
                "confidence": 0.95
            })

        # Standard Compliance (DIN, ISO, ASTM, ASME)
        std_match = re.search(r"(?i)\b(ISO\s*\d+|DIN\s*\d+|ASTM\s*[A-Z0-9]+|ASME\s*B\d+\.\d+)\b", cleaned)
        if std_match:
            sval = std_match.group(1).upper()
            ev = TextProcessor.find_evidence_snippet(cleaned, sval)
            attributes.append({
                "name": "compliance_standard",
                "value": sval,
                "unit": None,
                "data_type": "string",
                "evidence_snippet": ev["snippet"] if ev else f"Standard: {sval}",
                "confidence": 0.97
            })

        # Extract other key values
        candidates = TextProcessor.extract_candidate_key_values(cleaned)
        existing_names = {a["name"] for a in attributes}
        for k, v in candidates.items():
            if k not in existing_names and len(v) < 80:
                ev = TextProcessor.find_evidence_snippet(cleaned, v)
                attributes.append({
                    "name": k,
                    "value": v,
                    "unit": None,
                    "data_type": "string",
                    "evidence_snippet": ev["snippet"] if ev else f"{k}: {v}",
                    "confidence": 0.90
                })

        return {
            "product_name": product_name,
            "brand": brand,
            "sku": sku,
            "category": category,
            "subcategory": subcategory,
            "description": f"Engineered {product_name} designed for demanding industrial operations.",
            "attributes": attributes
        }

    async def validate_product(self, product_dict: Dict[str, Any], source_text: str) -> Dict[str, Any]:
        anomalies = []
        attrs = {a.get("name", ""): a.get("value", "") for a in product_dict.get("attributes", [])}
        
        # Check for conflicting pressure or temperatures
        if "pressure_rating" in attrs and "material" in attrs:
            if "plastic" in attrs["material"].lower() and "100 bar" in attrs["pressure_rating"].lower():
                anomalies.append({
                    "attribute_name": "pressure_rating",
                    "severity": "CONFLICT",
                    "message": "High pressure rating (100 bar) is inconsistent with polymer/plastic body material.",
                    "conflicting_values": [attrs["material"], attrs["pressure_rating"]]
                })

        return {
            "semantic_valid": len(anomalies) == 0,
            "anomalies": anomalies
        }

    async def enrich_product(self, product_dict: Dict[str, Any]) -> Dict[str, Any]:
        category = product_dict.get("category", "")
        attrs = {a.get("name", ""): a.get("value", "") for a in product_dict.get("attributes", [])}
        
        enriched = []
        if "Fasteners" in category:
            enriched.append({
                "field_name": "applications",
                "enriched_value": "Heavy machinery assembly, structural steel framing, marine equipment, automotive chassis",
                "enrichment_type": "ENRICHED",
                "rationale": "High-tensile corrosion-resistant fastener profile matches heavy industrial assembly requirements.",
                "confidence": 0.88
            })
            enriched.append({
                "field_name": "recommended_environment",
                "enriched_value": "Marine, coastal, and chemical processing environments (SS316 resistant to pitting)",
                "enrichment_type": "INFERRED",
                "rationale": "Inferred from SS316 molybdenum alloy composition.",
                "confidence": 0.92
            })
            enriched.append({
                "field_name": "search_tags",
                "enriched_value": "stainless hex bolt, M10 fastener, marine hardware, corrosion resistant screw",
                "enrichment_type": "ENRICHED",
                "rationale": "Search optimization keywords generated for B2B procurement catalog.",
                "confidence": 0.95
            })
        elif "Valves" in category:
            enriched.append({
                "field_name": "applications",
                "enriched_value": "Chemical processing lines, oil & gas distribution, steam systems, water treatment",
                "enrichment_type": "ENRICHED",
                "rationale": "Quarter-turn ball valve design with PTFE seating is standard for industrial chemical isolation.",
                "confidence": 0.90
            })
            enriched.append({
                "field_name": "maintenance_interval",
                "enriched_value": "Annual seal inspection / 50,000 cycles under standard operating pressures",
                "enrichment_type": "INFERRED",
                "rationale": "Standard industrial valve lifecycle baseline for stainless ball valves.",
                "confidence": 0.82
            })
        else:
            enriched.append({
                "field_name": "applications",
                "enriched_value": "Industrial automation, factory machinery, process monitoring",
                "enrichment_type": "ENRICHED",
                "rationale": "Standard industrial category application mapping.",
                "confidence": 0.85
            })

        return {"enriched_attributes": enriched}


class OpenAILLMClient(BaseLLMClient):
    """
    OpenAI-backed LLM Client with structured JSON outputs and automatic retry mechanism.
    """
    def __init__(self):
        from openai import AsyncOpenAI
        if not settings.OPENAI_API_KEY:
            raise AIProviderException("OPENAI_API_KEY is not configured in environment.")
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY, timeout=settings.LLM_TIMEOUT_SECONDS)
        self.model = settings.LLM_MODEL or "gpt-4o-mini"

    async def extract_product(self, text: str, category_hint: Optional[str] = None) -> Dict[str, Any]:
        prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "extraction_v1.txt")
        with open(prompt_path, "r", encoding="utf-8") as f:
            template = f.read()
        
        prompt = template.replace("{document_text}", text[:8000])
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                temperature=settings.LLM_TEMPERATURE,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are Veridexa Extraction Engine. Output strict JSON only."},
                    {"role": "user", "content": prompt}
                ]
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            logger.error(f"OpenAI extraction failed: {str(e)}")
            raise AIProviderException(f"OpenAI API error during extraction: {str(e)}")

    async def validate_product(self, product_dict: Dict[str, Any], source_text: str) -> Dict[str, Any]:
        prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "validation_v1.txt")
        with open(prompt_path, "r", encoding="utf-8") as f:
            template = f.read()
        
        prompt = template.replace("{product_json}", json.dumps(product_dict, indent=2)).replace("{source_text}", source_text[:4000])
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                temperature=settings.LLM_TEMPERATURE,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are Veridexa Validation Engine. Output strict JSON only."},
                    {"role": "user", "content": prompt}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"OpenAI validation failed: {str(e)}")
            raise AIProviderException(f"OpenAI API error during validation: {str(e)}")

    async def enrich_product(self, product_dict: Dict[str, Any]) -> Dict[str, Any]:
        prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "enrichment_v1.txt")
        with open(prompt_path, "r", encoding="utf-8") as f:
            template = f.read()
        
        prompt = template.replace("{product_json}", json.dumps(product_dict, indent=2))
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                temperature=0.2,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are Veridexa Enrichment Engine. Output strict JSON only."},
                    {"role": "user", "content": prompt}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"OpenAI enrichment failed: {str(e)}")
            raise AIProviderException(f"OpenAI API error during enrichment: {str(e)}")


def get_llm_client() -> BaseLLMClient:
    """
    Factory function returning the configured LLM provider or falling back to LocalMockLLMClient.
    """
    provider = settings.LLM_PROVIDER.lower()
    if provider == "openai" and settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY.strip()) > 5:
        try:
            return OpenAILLMClient()
        except Exception as e:
            logger.warning(f"Could not initialize OpenAILLMClient ({str(e)}), using LocalMockLLMClient fallback.")
            return LocalMockLLMClient()
    return LocalMockLLMClient()
