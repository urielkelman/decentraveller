from typing import Optional

from fastapi import Depends, HTTPException, Response, Query
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter

from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.api_models.rule import RuleInput, RuleInDB, RuleActionInput, RuleId, RuleProposedDeletionInput, \
    GetRulesResponse, RuleProposalQueuedInput
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
    def approve_rule(self, rule_approved: RuleActionInput) -> RuleInDB:
        """
        Updates a rule to be approved.

        :param rule_approved: the rule that was approved.
        :return: the rule data.
        """
        rule = self.database.update_rule_to_approved(rule_approved.rule_id)
        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule

    @rule_router.post("/rule-deletion", status_code=201, dependencies=[Depends(indexer_auth)])
    def propose_rule_deletion(self, rule_proposed_deletion: RuleProposedDeletionInput) -> RuleInDB:
        """
        Updates a rule to be proposed for deletion.

        :param rule_proposed_deletion: the rule that was proposed for deletion.
        :return: the rule data.
        """
        rule = self.database.update_rule_to_propose_deletion(rule_proposed_deletion)
        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule

    @rule_router.post("/rule-deletion/delete", status_code=201, dependencies=[Depends(indexer_auth)])
    def delete_rule(self, rule_deleted: RuleActionInput):
        """
        Updates a rule to be deleted.

        :param rule_deleted: the rule that was deleted.
        :return: the rule data.
        """
        rule = self.database.update_rule_to_deleted(rule_deleted.rule_id)

        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule

    @rule_router.get("/rule", status_code=200)
    def get_rules(self, rule_status: Optional[RuleStatus] = Query(default=None)):
        rules = self.database.get_rule_by_status(rule_status)

        return GetRulesResponse(rules=rules)

    @rule_router.get("/rule/{rule_id}", status_code=200)
    def get_rule(self, rule_id: RuleId):
        rule = self.database.get_rule_by_id(rule_id)
        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule

    @rule_router.post("/rule/proposal", status_code=201)
    def update_rule_timestamp_with_proposal(self, rule_proposal_input: RuleProposalQueuedInput):
        rule = self.database.update_execution_time_by_proposal_id(rule_proposal_input)

        proposer = rule.deletion_proposer if rule.deletion_proposer else rule.proposer
        if proposer:
            rule_proposer = self.database.get_profile_orm(proposer)
            if rule_proposer.push_token:
                self.push_notification_adapter.send_rule_queued(rule_proposer.push_token,
                                                                rule.rule_id)

        if rule is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)

        return rule
