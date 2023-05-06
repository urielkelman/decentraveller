from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from src.orms import Base


class ProfileORM(Base):
    """
    Profile object-relational mapping
    """
    __tablename__ = "profiles"
    owner = Column(String, nullable=False, unique=True, primary_key=True)
    nickname = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    interest = Column(String, nullable=False)
