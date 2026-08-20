import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.product_attribute import OriginType

class EnrichmentResult(Base):
    __tablename__ = "enrichment_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    
    field_name: Mapped[str] = mapped_column(String(128), nullable=False)
    original_value: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    enriched_value: Mapped[str] = mapped_column(Text, nullable=False)
    enrichment_type: Mapped[OriginType] = mapped_column(Enum(OriginType), default=OriginType.ENRICHED)
    rationale: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.85)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="enrichment_results")
