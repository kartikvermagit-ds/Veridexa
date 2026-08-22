import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum

class SourceType(str, enum.Enum):
    PDF = "PDF"
    CSV = "CSV"
    TEXT = "TEXT"
    URL = "URL"
    CATALOG = "CATALOG"

class ProductSource(Base):
    __tablename__ = "product_sources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType), default=SourceType.PDF)
    file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    raw_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="sources")
    evidence_list: Mapped[List["ProductEvidence"]] = relationship(
        "ProductEvidence", back_populates="source", cascade="all, delete-orphan", lazy="selectin"
    )
