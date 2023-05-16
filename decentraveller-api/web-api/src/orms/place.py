from sqlalchemy import Column, String, Float, Integer, Enum
from src.orms import Base
from src.api_models.place import PlaceCategory


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
    category = Column(Enum(PlaceCategory), nullable=True)