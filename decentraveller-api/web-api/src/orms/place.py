from sqlalchemy import Column, String, Float, Integer, Enum, ForeignKey

from src.api_models.place_category import PlaceCategory
from src.orms import Base


class PlaceORM(Base):
    """
    Place object-relational mapping
    """
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    owner = Column(ForeignKey("profiles.owner"), nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    category = Column(Enum(PlaceCategory), nullable=True)
