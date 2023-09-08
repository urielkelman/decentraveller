from sqlalchemy import Column, ForeignKey, ForeignKeyConstraint, Integer, String, DateTime

from src.orms import Base

class Rule(Base):
    """
    Rule object-relational mapping
    """
    __tablename__ = "rules"
    rule_id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, unique=True)
    proposer = Column(ForeignKey("profiles.owner"), nullable=True)
    statement = Column(String)
    proposed_at = Column(DateTime)
