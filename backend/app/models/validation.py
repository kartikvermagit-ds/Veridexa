import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum

class RuleType(str, enum.Enum):
    DETERMINISTIC = "DETERMINISTIC"
    AI_SEMANTIC = "AI_SEMANTIC"

class ValidationResultStatus(str, enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    CONFLICT = "CONFLICT"
    WARNING = "WARNING"

class ValidationResult(Base):
    __tablename__ = "validation_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    attribute_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("product_attributes.id", ondelete="SET NULL"), nullable=True
    )
    
    rule_name: Mapped[str] = mapped_column(String(128), nullable=False)
    rule_type: Mapped[RuleType] = mapped_column(Enum(RuleType), default=RuleType.DETERMINISTIC)
    status: Mapped[ValidationResultStatus] = mapped_column(
        Enum(ValidationResultStatus), default=ValidationResultStatus.PASS, index=True
    )
    message: Mapped[str] = mapped_column(Text, nullable=False)
    field_name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    conflicting_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="validation_results")
