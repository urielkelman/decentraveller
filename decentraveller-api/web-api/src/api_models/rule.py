from datetime import datetime

from fastapi_utils.api_model import APIModel

from typing import NewType, Optional

from pydantic import Field, validator

RuleId = NewType("RuleId", int)


class RuleBody(APIModel):
    """
    Rule API Model
    """
    rule_id: RuleId
    proposal_id: Optional[str]
    rule_statement: str
    proposer: Optional[str]

    @validator("proposer")
    def check_lower(cls, value):
        if value is None:
            return None
        return value.lower()

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
