import os
from typing import List, Dict, Any, Optional
import pypdf
import pdfplumber
from app.core.logging import logger

class PDFProcessor:
    """
    Extracts text, page numbers, layout coordinates, and structured tables from PDF files.
    """

    @classmethod
    def extract_pages(cls, file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text page-by-page with page numbers and detected tables.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF file not found: {file_path}")

        pages_data = []
        try:
            with pdfplumber.open(file_path) as pdf:
                for idx, page in enumerate(pdf.pages):
                    page_num = idx + 1
                    text = page.extract_text() or ""
                    
                    # Extract tables if present
                    tables = []
                    extracted_tables = page.extract_tables()
                    if extracted_tables:
                        for tbl in extracted_tables:
                            cleaned_tbl = [[cell.strip() if cell else "" for cell in row] for row in tbl if any(row)]
                            if cleaned_tbl:
                                tables.append(cleaned_tbl)

                    pages_data.append({
                        "page_number": page_num,
                        "text": text.strip(),
                        "tables": tables,
                        "char_count": len(text)
                    })
        except Exception as e:
            logger.warning(f"pdfplumber extraction failed ({str(e)}), falling back to pypdf...")
            try:
                reader = pypdf.PdfReader(file_path)
                for idx, page in enumerate(reader.pages):
                    page_num = idx + 1
                    text = page.extract_text() or ""
                    pages_data.append({
                        "page_number": page_num,
                        "text": text.strip(),
                        "tables": [],
                        "char_count": len(text)
                    })
            except Exception as e2:
                logger.error(f"Failed to extract PDF via pypdf: {str(e2)}")
                raise ValueError(f"Could not parse PDF file: {str(e2)}")

        return pages_data

    @classmethod
    def find_snippet_in_pdf(cls, pages_data: List[Dict[str, Any]], target_value: str) -> Optional[Dict[str, Any]]:
        """
        Scans all extracted pages to find the exact page number and text snippet for a target value.
        """
        from app.processors.text_processor import TextProcessor
        
        for page in pages_data:
            page_text = page.get("text", "")
            match = TextProcessor.find_evidence_snippet(page_text, target_value)
            if match:
                return {
                    "page_number": page["page_number"],
                    "snippet": match["snippet"],
                    "char_start": match["char_start"],
                    "char_end": match["char_end"]
                }
        return None
