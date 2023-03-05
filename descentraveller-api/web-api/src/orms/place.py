from sqlalchemy import Column, String, Float, JSON, ARRAY, Integer
from src.orms import Base


class PlaceORM(Base):
    """
    Place object-relational mapping
    """
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    open_hours = Column(JSON, nullable=True)
    categories = Column(String, nullable=True)
    sub_categories = Column(String, nullable=True)
