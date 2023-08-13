from sqlalchemy import Column, String, Integer, ForeignKey, func, DateTime

from src.orms import Base


class ReviewORM(Base):
    """
    Review object-relational mapping
    """
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    place_id = Column(ForeignKey("places.id"), primary_key=True)
    score = Column(Integer, nullable=False)
    owner = Column(ForeignKey("profiles.owner"), nullable=False)
    text = Column(String, nullable=False)
    state = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
