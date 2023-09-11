from enum import Enum

from sqlalchemy import Column, ForeignKey, Boolean, Integer, String, DateTime, Enum as DBEnum

from src.orms import Base


class RuleStatus(str, Enum):
    PENDING_VOTE = "PENDING_VOTE"
    ACTIVE_VOTE = "ACTIVE_VOTE"
    DEFEATED = "DEFEATED"
    SUCCEEDED = "SUCCEEDED"
    QUEUED = "QUEUED"
    EXECUTED = "EXECUTED"


class RuleORM(Base):
    """
    Rule object-relational mapping
    """
    __tablename__ = "rules"
    rule_id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, unique=True)
    proposer = Column(ForeignKey("profiles.owner"), nullable=True)
    rule_statement = Column(String)
    proposed_at = Column(DateTime)
    rule_status = Column(DBEnum(RuleStatus))
    is_initial = Column(Boolean)
