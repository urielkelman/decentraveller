from fastapi import Depends, HTTPException, Response
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter

from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.api_models.rule import RuleInput, RuleInDB, RuleApprovedInput, RuleId
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.push_notification_adapter import PushNotificationAdapter
from src.dependencies.relational_database import RelationalDatabase, build_relational_database
from src.orms.rule import RuleStatus

rule_router = InferringRouter()


@cbv(rule_router)
class RuleCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    push_notification_adapter: PushNotificationAdapter = Depends(PushNotificationAdapter)

    @rule_router.post("/rule", status_code=201, dependencies=[Depends(indexer_auth)])
    def create_rule(self, rule: RuleInput) -> RuleInDB:
        """
        Creates a new rule in the database.

        :param rule: the rule data.
        :return: the created rule.
        """
        try:
            inserted_rule = self.database.add_rule(rule)
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Bad request, please check the proposer is "
                                                                         "registered")

        return inserted_rule

    @rule_router.post("/rule/approve", status_code=201, dependencies=[Depends(indexer_auth)])
    def approve_rule(self, rule_approved: RuleApprovedInput) -> RuleInDB:
        """
        Updates a rule to be approved.

        :param rule_approved: the rule that was approved.
        :return: the rule data.
        """
        rule = self.database.update_rule_status(rule_approved.rule_id, RuleStatus.EXECUTED)
        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule

    @rule_router.get("/rule/{rule_id}", status_code=200)
    def get_rule(self, rule_id: RuleId):
        rule = self.database.get_rule_by_id(rule_id)
        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule
