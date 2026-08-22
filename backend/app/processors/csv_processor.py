import csv
import io
import os
import re
import uuid
from typing import List, Dict, Any, Optional, Tuple
from app.processors.normalizer import AttributeNormalizer
from app.processors.text_processor import TextProcessor

class CSVProcessor:
    """
    Dynamic, schema-agnostic industrial CSV processor.
    Handles arbitrary column structures, multi-encoding files, varying delimiters,
    multi-row product batches, and generates structured product records with exact evidence citations.
    """

    ENCODINGS = ["utf-8-sig", "utf-8", "cp1252", "latin-1", "iso-8859-1"]

    CORE_FIELD_CANDIDATES = {
        "sku": [
            "sku", "part_number", "part_no", "partnumber", "part_num", "part#",
            "item_number", "item_code", "item_no", "code", "model", "model_number",
            "model_no", "product_code", "catalog_number", "cat_no", "id"
        ],
        "product_name": [
            "product_name", "product", "name", "title", "item_name", "item",
            "part_name", "model_name", "description_title", "headline"
        ],
        "brand": [
            "brand", "brand_name", "manufacturer", "mfg", "vendor", "make",
            "supplier", "oem", "company"
        ],
        "category": [
            "category", "product_category", "cat", "product_type", "type",
            "group", "segment", "class", "classification"
        ],
        "subcategory": [
            "subcategory", "sub_category", "subtype", "sub_type", "subgroup",
            "sub_group", "family"
        ],
        "description": [
            "description", "desc", "summary", "details", "overview", "notes",
            "technical_description", "spec_summary"
        ]
    }

    @classmethod
    def read_text_from_file_or_content(cls, file_path: Optional[str] = None, raw_content: Optional[bytes] = None) -> str:
        """
        Reads CSV file content attempting multiple standard encodings gracefully.
        """
        if raw_content is None and file_path:
            if not os.path.exists(file_path):
                raise ValueError(f"File not found: {file_path}")
            with open(file_path, "rb") as f:
                raw_content = f.read()

        if raw_content is None or len(raw_content) == 0:
            raise ValueError("CSV file is empty.")

        for enc in cls.ENCODINGS:
            try:
                decoded = raw_content.decode(enc)
                if "\x00" in decoded:
                    decoded = decoded.replace("\x00", "")
                return decoded
            except (UnicodeDecodeError, LookupError):
                continue

        # Fallback with ignore errors
        return raw_content.decode("utf-8", errors="ignore")

    @classmethod
    def detect_delimiter(cls, sample_text: str) -> str:
        """
        Detects CSV delimiter (comma, semicolon, tab, pipe) using Sniffer or frequency analysis.
        """
        sample_lines = [line for line in sample_text.splitlines() if line.strip()][:5]
        if not sample_lines:
            return ","

        sample = "\n".join(sample_lines)
        try:
            sniffer = csv.Sniffer()
            dialect = sniffer.sniff(sample, delimiters=",;\t|")
            return dialect.delimiter
        except Exception:
            pass

        # Heuristic delimiter count fallback
        delimiters = [",", ";", "\t", "|"]
        counts = {d: sum(line.count(d) for line in sample_lines) for d in delimiters}
        best = max(counts, key=counts.get)
        return best if counts[best] > 0 else ","

    @classmethod
    def _clean_header(cls, header: str) -> str:
        """
        Normalizes a column header string into a clean identifier while retaining meaning.
        """
        if not header:
            return ""
        # Remove BOM or surrounding quotes/spaces
        cleaned = header.strip().strip("'\"").strip()
        return cleaned

    @classmethod
    def _match_core_field(cls, header: str) -> Optional[str]:
        """
        Matches a header to a core product field (sku, product_name, brand, category, etc.)
        """
        norm = re.sub(r"[^a-z0-9]", "_", header.lower()).strip("_")
        for field, candidates in cls.CORE_FIELD_CANDIDATES.items():
            if norm in candidates:
                return field

        # Keyword / token-level heuristics
        tokens = norm.split("_")
        if any(t in tokens for t in ["name", "title", "headline"]):
            return "product_name"
        if any(t in tokens for t in ["sku", "partno", "itemcode"]):
            return "sku"
        if any(t in tokens for t in ["brand", "manufacturer", "mfg", "vendor", "supplier"]):
            return "brand"
        if any(t in tokens for t in ["category", "cat"]):
            return "category"
        if any(t in tokens for t in ["subcategory"]):
            return "subcategory"
        if any(t in tokens for t in ["description", "desc", "overview"]):
            return "description"
        return None

    @classmethod
    def parse_csv_content(
        cls,
        csv_text: str,
        category_hint: Optional[str] = None,
        file_name: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Parses raw CSV string into a list of standardized product dictionaries.
        Supports single-row and multi-row catalogs dynamically.
        """
        if not csv_text or not csv_text.strip():
            raise ValueError("CSV file is empty.")

        delimiter = cls.detect_delimiter(csv_text)
        
        # Read using csv.reader to handle quotes and multi-line values correctly
        reader = csv.reader(io.StringIO(csv_text), delimiter=delimiter)
        raw_rows = [r for r in reader if r]

        if not raw_rows:
            raise ValueError("CSV file contains no data rows.")

        # Header row
        raw_headers = raw_rows[0]
        cleaned_headers = [cls._clean_header(h) for h in raw_headers]
        
        # Check if all headers are empty
        if not any(cleaned_headers):
            raise ValueError("CSV file is missing a valid header row.")

        # Ensure unique headers by appending index to duplicates or empty headers
        headers = []
        seen = {}
        for idx, h in enumerate(cleaned_headers):
            h_name = h if h else f"column_{idx+1}"
            if h_name.lower() in seen:
                seen[h_name.lower()] += 1
                headers.append(f"{h_name}_{seen[h_name.lower()]}")
            else:
                seen[h_name.lower()] = 1
                headers.append(h_name)

        data_rows = []
        for r in raw_rows[1:]:
            if any(cell.strip() for cell in r):
                data_rows.append([cell.strip() for cell in r])

        if not data_rows:
            raise ValueError("CSV file contains headers but no product records.")

        products = []

        for row_idx, row in enumerate(data_rows, start=1):
            # Pad row if fewer columns than headers
            if len(row) < len(headers):
                row = row + [""] * (len(headers) - len(row))

            row_dict = {}
            for h, cell in zip(headers, row):
                val = cell.strip()
                if val:
                    row_dict[h] = val

            if not row_dict:
                continue

            # Identify core fields from column headers
            field_mappings = {}
            unmapped_columns = {}

            for h, val in row_dict.items():
                matched_field = cls._match_core_field(h)
                if matched_field and matched_field not in field_mappings:
                    field_mappings[matched_field] = (h, val)
                else:
                    unmapped_columns[h] = val

            # Extract or synthesize Core Product Fields
            sku = field_mappings.get("sku", (None, ""))[1]
            product_name = field_mappings.get("product_name", (None, ""))[1]
            brand = field_mappings.get("brand", (None, ""))[1]
            category = field_mappings.get("category", (None, ""))[1]
            subcategory = field_mappings.get("subcategory", (None, ""))[1]
            description = field_mappings.get("description", (None, ""))[1]

            # Inferences and defaults if core fields are not explicitly provided
            if not sku:
                # Deterministic yet unique SKU fallback
                sku = f"KAV-{str(uuid.uuid4())[:8].upper()}"

            if not product_name:
                # Try finding in unmapped columns or construct from brand + category
                if "model" in row_dict:
                    product_name = f"{brand} {row_dict['model']}".strip()
                elif category:
                    product_name = f"{category} Component"
                else:
                    product_name = "Industrial Component"

            if not brand:
                brand = "KAVRIX Industrial"

            if not category:
                if category_hint:
                    category = category_hint
                else:
                    # Infer category from product_name or unmapped columns
                    combined_text = f"{product_name} {' '.join(row_dict.values())}".lower()
                    if any(k in combined_text for k in ["bolt", "fastener", "screw", "nut", "thread"]):
                        category = "Industrial Fasteners"
                        subcategory = subcategory or "Hex Head Fasteners"
                    elif any(k in combined_text for k in ["valve", "ball valve", "actuator"]):
                        category = "Process Valves"
                        subcategory = subcategory or "Ball Valves"
                    elif any(k in combined_text for k in ["pump", "slurry", "impeller", "centrifugal"]):
                        category = "Fluid Handling"
                        subcategory = subcategory or "Centrifugal Pumps"
                    elif any(k in combined_text for k in ["sensor", "transmitter", "transducer", "gauge"]):
                        category = "Sensors & Instrumentation"
                        subcategory = subcategory or "Pressure Transmitters"
                    else:
                        category = "Industrial Equipment"

            # Build Attributes from all row columns (excluding non-attribute descriptions if very long)
            attributes = []
            
            for h, val in row_dict.items():
                # Normalized attribute name
                attr_name = re.sub(r"[^a-zA-Z0-9_\-\s]", "", h).strip().lower().replace(" ", "_")
                if not attr_name:
                    attr_name = f"spec_{len(attributes)+1}"

                # Skip standard description column from raw attributes list if it's already in description
                if attr_name in ["description", "overview", "notes", "summary"] and len(val) > 100:
                    continue

                # Value and Unit extraction
                norm_val = val
                unit = None

                # Check if this attribute represents material
                if "material" in attr_name:
                    norm_val = AttributeNormalizer.normalize_material(val)
                elif "pressure" in attr_name:
                    cleaned_num, detected_unit = AttributeNormalizer.normalize_unit_value(val)
                    if detected_unit:
                        unit = detected_unit
                elif "temp" in attr_name:
                    unit = "°C" if "c" in val.lower() else ("°F" if "f" in val.lower() else None)
                elif "flow" in attr_name:
                    cleaned_num, detected_unit = AttributeNormalizer.normalize_unit_value(val)
                    if detected_unit:
                        unit = detected_unit
                else:
                    _, detected_unit = AttributeNormalizer.normalize_unit_value(val)
                    if detected_unit:
                        unit = detected_unit

                # Check for thread and length composite
                if "thread" in attr_name or "size" in attr_name or "dimensions" in attr_name:
                    th, lg = AttributeNormalizer.normalize_thread_and_length(val)
                    if th and not any(a["name"] == "thread_size" for a in attributes):
                        attributes.append({
                            "name": "thread_size",
                            "value": th,
                            "unit": "metric",
                            "data_type": "string",
                            "evidence_snippet": f"CSV Row {row_idx} [{h}]: {val}",
                            "confidence": 0.98
                        })
                    if lg and not any(a["name"] == "length" for a in attributes):
                        attributes.append({
                            "name": "length",
                            "value": lg,
                            "unit": "mm",
                            "data_type": "string",
                            "evidence_snippet": f"CSV Row {row_idx} [{h}]: {val}",
                            "confidence": 0.97
                        })

                # Evidence snippet referencing exact CSV row and column
                evidence_snippet = f"CSV Row {row_idx} [{h}]: {val}"

                attributes.append({
                    "name": attr_name,
                    "value": norm_val,
                    "unit": unit,
                    "data_type": "string",
                    "evidence_snippet": evidence_snippet,
                    "confidence": 0.95
                })

            if not description:
                key_specs = ", ".join([f"{a['name']}={a['value']}" for a in attributes[:4]])
                description = f"High-precision {product_name} manufactured by {brand}. Specifications: {key_specs}."

            # Construct structured representation text for semantic checks & LLM
            row_doc_lines = [
                f"Product Name: {product_name}",
                f"SKU / Part Number: {sku}",
                f"Brand: {brand}",
                f"Category: {category}"
            ]
            if subcategory:
                row_doc_lines.append(f"Subcategory: {subcategory}")
            row_doc_lines.append(f"Description: {description}")
            row_doc_lines.append("\nTechnical Specifications (CSV Row Data):")
            for h, v in row_dict.items():
                row_doc_lines.append(f"- {h}: {v}")

            row_document_text = "\n".join(row_doc_lines)

            products.append({
                "row_index": row_idx,
                "sku": sku,
                "product_name": product_name,
                "brand": brand,
                "category": category,
                "subcategory": subcategory,
                "description": description,
                "attributes": attributes,
                "document_text": row_document_text,
                "raw_row": row_dict
            })

        return products

    @classmethod
    def parse_file(
        cls,
        file_path: str,
        category_hint: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Parses a CSV file on disk.
        """
        csv_text = cls.read_text_from_file_or_content(file_path=file_path)
        file_name = os.path.basename(file_path)
        return cls.parse_csv_content(csv_text, category_hint=category_hint, file_name=file_name)
