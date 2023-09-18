import logging
import time

from src.api_models.rule import RuleInput
from src.dependencies.blockchain_adapter import BlockchainAdapter
from src.dependencies.relational_database import RelationalDatabase

logger = logging.getLogger(__name__)


async def load_initial_rules():
    from src.database.session import SessionLocal

    database = RelationalDatabase(SessionLocal)
    blockchain_adapter = BlockchainAdapter()
    stop_fetching_rules = False
    rule_id = 1
    while not stop_fetching_rules:
        rule = blockchain_adapter.get_rule_by_id(rule_id)
        if rule is not None:
            # We save the rule without a proposer profile. We don't want to damage user experience saving and showing
            # an artificial profile (the deployer). The proposer has a FK constraint attached, but it can be nullable
            # for this specific use case. For other use cases, the proposer shouldn't be null. Also, we save the
            # proposal id with a null value as well, since the rule was created at initialization without a proposal.
            rule_input = RuleInput(rule_id=rule_id, proposal_id=None, rule_statement=rule[5],
                                   proposer=None, timestamp=time.time())
            logging.info("Saving rule with id: {} and statement: {}".format(rule_id, rule[5]))
            database.add_rule(rule_input, is_initial_rule=True)
            rule_id += 1
        else:
            stop_fetching_rules = True
