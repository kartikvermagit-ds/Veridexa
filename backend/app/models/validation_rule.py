import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy import String, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base

class ValidationRule(Base):
    __tablename__ = "validation_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    field_name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    rule_type: Mapped[str] = mapped_column(String(64), default="UNIT_CHECK")
    
    # JSON-based rule parameters (e.g. allowed_units, min_val, max_val, regex)
    rule_config: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
