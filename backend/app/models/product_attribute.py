import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum

class OriginType(str, enum.Enum):
    EXTRACTED = "EXTRACTED"
    ENRICHED = "ENRICHED"
    INFERRED = "INFERRED"

class AttributeStatus(str, enum.Enum):
    VALIDATED = "VALIDATED"
    UNVERIFIED = "UNVERIFIED"
    CONFLICT = "CONFLICT"
    UNKNOWN = "UNKNOWN"

class ProductAttribute(Base):
    __tablename__ = "product_attributes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    value: Mapped[str] = mapped_column(String(512), nullable=False)
    raw_value: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    data_type: Mapped[str] = mapped_column(String(32), default="string")
    
    # Origin classification & confidence
    origin_type: Mapped[OriginType] = mapped_column(Enum(OriginType), default=OriginType.EXTRACTED)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[AttributeStatus] = mapped_column(Enum(AttributeStatus), default=AttributeStatus.UNVERIFIED)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="attributes")
    evidence: Mapped[List["ProductEvidence"]] = relationship(
        "ProductEvidence", back_populates="attribute", cascade="all, delete-orphan", lazy="selectin"
    )
