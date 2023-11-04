from sqlalchemy import Column, String, Enum, DateTime, func, ForeignKey

from src.api_models.place_category import PlaceCategory
from src.api_models.user_role import ProfileRole
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
    role = Column(Enum(ProfileRole), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ipfs_hash = Column(ForeignKey("images.hash"), default=None)
    push_token = Column(String, nullable=True, default=None)
