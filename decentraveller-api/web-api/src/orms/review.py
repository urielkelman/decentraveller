from enum import Enum

from sqlalchemy import Column, String, Integer, ForeignKey, func, DateTime, Enum as DBEnum, JSON

from src.orms import Base


class ReviewStatus(str, Enum):
    PUBLIC = 'PUBLIC'
    CENSORED = 'CENSORED'
    CENSORSHIP_CHALLENGED = 'CENSORSHIP_CHALLENGED'
    UNCENSORED_BY_CHALLENGE = 'UNCENSORED_BY_CHALLENGE'


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
    status = Column(DBEnum(ReviewStatus), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    censor_moderator = Column(ForeignKey("profiles.owner"), nullable=True, default=None)
    broken_rule_id = Column(ForeignKey("rules.rule_id"), nullable=True, default=None)
    challenge_deadline = Column(DateTime, nullable=True, default=None)
    juries = Column(JSON, nullable=True, default=None)
