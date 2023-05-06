from sqlalchemy import Column, String, Float, Integer
from sqlalchemy.orm import relationship

from src.orms import Base


class PlaceORM(Base):
    """
    Place object-relational mapping
    """
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    categories = Column(String, nullable=True)
    sub_categories = Column(String, nullable=True)
