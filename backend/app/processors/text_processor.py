import re
from typing import List, Dict, Any, Optional

class TextProcessor:
    """
    Cleans raw industrial text, normalizes whitespace, extracts candidate spec lines,
    and calculates character offset mappings for evidence tracking.
    """

    @classmethod
    def clean_text(cls, raw: str) -> str:
        if not raw:
            return ""
        # Normalize non-breaking spaces and unusual unicode
        text = raw.replace("\u00a0", " ").replace("\r\n", "\n").replace("\r", "\n")
        # Remove consecutive blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    @classmethod
    def extract_candidate_key_values(cls, text: str) -> Dict[str, str]:
        """
        Heuristically extracts key-value patterns (e.g. 'Material: SS316', 'Operating Temp: -40°C to 120°C')
        """
        candidates = {}
        for line in text.split("\n"):
            line = line.strip()
            if not line or len(line) > 200:
                continue
            
            # Match colon, equals, or tab separators
            match = re.match(r"^([A-Za-z0-9\s_\-\/]{2,40})[:=\t]\s*(.+)$", line)
            if match:
                key = match.group(1).strip().lower().replace(" ", "_")
                val = match.group(2).strip()
                if len(val) > 0 and len(val) < 150:
                    candidates[key] = val
        return candidates

    @classmethod
    def find_evidence_snippet(cls, document_text: str, target_value: str, window_chars: int = 120) -> Optional[Dict[str, Any]]:
        """
        Finds exact or near-match occurrence of target_value in document text
        and extracts surrounding snippet with start and end character offsets.
        """
        if not document_text or not target_value:
            return None
        
        # Clean query
        query = re.escape(target_value.strip())
        pattern = re.compile(rf"(?:^|\b|\s)({query})(?:$|\b|\s|[.,;])", re.IGNORECASE)
        match = pattern.search(document_text)
        
        if not match:
            # Try simple substring
            idx = document_text.lower().find(target_value.lower().strip())
            if idx == -1:
                return None
            start_pos = idx
            end_pos = idx + len(target_value.strip())
        else:
            start_pos = match.start(1)
            end_pos = match.end(1)
            
        snippet_start = max(0, start_pos - window_chars)
        snippet_end = min(len(document_text), end_pos + window_chars)
        
        snippet = document_text[snippet_start:snippet_end].strip()
        return {
            "snippet": f"...{snippet}..." if snippet_start > 0 else f"{snippet}...",
            "char_start": start_pos,
            "char_end": end_pos,
            "exact_match": True
        }
