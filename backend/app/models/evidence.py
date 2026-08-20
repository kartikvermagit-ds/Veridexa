import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

class ProductEvidence(Base):
    __tablename__ = "product_evidence"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    attribute_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("product_attributes.id", ondelete="CASCADE"), index=True
    )
    source_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("product_sources.id", ondelete="CASCADE"), index=True
    )
    
    page_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    snippet: Mapped[str] = mapped_column(Text, nullable=False)
    char_start: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    char_end: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    bounding_box: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    attribute: Mapped["ProductAttribute"] = relationship("ProductAttribute", back_populates="evidence")
    source: Mapped["ProductSource"] = relationship("ProductSource", back_populates="evidence_list")
