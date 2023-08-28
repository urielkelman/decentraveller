from sqlalchemy import Column, String, Boolean, func, DateTime, Float

from src.orms import Base


class ImageORM(Base):
    """
    Image object-relational mapping
    """
    __tablename__ = "images"

    hash = Column(String, primary_key=True)
    pinned = Column(Boolean, default=False)
    score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
