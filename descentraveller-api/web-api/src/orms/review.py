from sqlalchemy import Column, String, JSON, Integer, ForeignKey

from src.orms import Base


class ReviewORM(Base):
    """
    Review object-relational mapping
    """
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    place_id = Column(Integer, ForeignKey("places.id"),
                      primary_key=False, nullable=False)
    score = Column(Integer, nullable=False)
    owner = Column(String, nullable=False)
    text = Column(String, nullable=False)
    images = Column(JSON, nullable=False)
    state = Column(String, nullable=False)