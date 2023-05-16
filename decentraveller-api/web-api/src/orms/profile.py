from sqlalchemy import Column, String, Enum
from src.api_models.place import PlaceCategory
from src.orms import Base


class ProfileORM(Base):
    """
    Profile object-relational mapping
    """
    __tablename__ = "profiles"
    owner = Column(String(42), nullable=False, unique=True, primary_key=True)
    nickname = Column(String, nullable=False, unique=True)
    country = Column(String, nullable=False)
    interest = Column(Enum(PlaceCategory), nullable=False)
    avatar_ipfs_uri = Column(String, default=None)