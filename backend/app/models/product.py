import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Float, DateTime, Text, JSON, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum

class ValidationStatus(str, enum.Enum):
    PENDING = "PENDING"
    VALIDATED = "VALIDATED"
    CONFLICT = "CONFLICT"
    ANOMALY = "ANOMALY"

class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    category: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    subcategory: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Aggregated metrics
    completeness: Mapped[float] = mapped_column(Float, default=0.0)
    overall_confidence: Mapped[float] = mapped_column(Float, default=0.0)
    validation_status: Mapped[ValidationStatus] = mapped_column(
        Enum(ValidationStatus), default=ValidationStatus.PENDING, index=True
    )
    
    # Flexible raw key-value store for unstructured extractions
    raw_attributes: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    attributes: Mapped[List["ProductAttribute"]] = relationship(
        "ProductAttribute", back_populates="product", cascade="all, delete-orphan", lazy="selectin"
    )
    sources: Mapped[List["ProductSource"]] = relationship(
        "ProductSource", back_populates="product", cascade="all, delete-orphan", lazy="selectin"
    )
    validation_results: Mapped[List["ValidationResult"]] = relationship(
        "ValidationResult", back_populates="product", cascade="all, delete-orphan", lazy="selectin"
    )
    enrichment_results: Mapped[List["EnrichmentResult"]] = relationship(
        "EnrichmentResult", back_populates="product", cascade="all, delete-orphan", lazy="selectin"
    )
