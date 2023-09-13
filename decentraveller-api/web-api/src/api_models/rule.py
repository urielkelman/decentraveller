from datetime import datetime

from fastapi_utils.api_model import APIModel

from typing import NewType, Optional

from pydantic import Field

RuleId = NewType("RuleId", int)


class RuleBody(APIModel):
    """
    Rule API Model
    """
    rule_id: RuleId = Field(alias="ruleId")
    proposal_id: Optional[str] = Field(alias="proposalId")
    rule_statement: str = Field(alias="ruleStatement")
    proposer: Optional[str]


class RuleInput(RuleBody):
    """
    Rule input API
    """
    timestamp: int


class RuleInDB(RuleBody):
    """
    Rule API model
    """
    rule_status: str
    proposed_at: datetime
    is_initial: bool

class RuleApprovedInput(APIModel):
    rule_id: RuleId
