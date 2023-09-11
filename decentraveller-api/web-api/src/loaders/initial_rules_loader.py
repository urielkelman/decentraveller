import os
import json
import logging
import os
import time

from web3 import Web3, exceptions

from src.api_models.rule import RuleInput
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from src.loaders.config import contract_address_by_chain_id
from src.database.session import SessionLocal

logger = logging.getLogger(__name__)

BLOCKCHAIN_RPC_URL = os.getenv('BLOCKCHAIN_RPC_URL')

w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_RPC_URL))
contract_address = contract_address_by_chain_id[w3.eth.chain_id]


async def load_initial_rules():
    logger.info("Prueba de logging")
    logger.info(os.listdir())
    with open('src/loaders/decentraveller_abi.json', 'r') as abi_file:
        decentraveller_contract_abi = json.load(abi_file)
    database = RelationalDatabase(SessionLocal)
    checksum_contract_address = w3.to_checksum_address(contract_address)
    decentraveller_contract = w3.eth.contract(checksum_contract_address, abi=decentraveller_contract_abi)
    stop_fetching_rules = False
    rule_id = 1
    while not stop_fetching_rules:
        try:
            rule = decentraveller_contract.functions.getRuleById(rule_id).call()
            # We save the rule without a proposer profile. We don't want to damage user experience saving and showing
            # an artificial profile (the deployer). The proposer has a FK constraint attached, but it can be nullable
            # for this specific use case. For other use cases, the proposer shouldn't be null.
            rule_input = RuleInput(rule_id=rule_id, proposal_id=0, rule_statement=rule[5],
                                   proposer=None, timestamp=time.time())
            logging.info("Saving rule with id: {} and statement: {}".format(rule_id, rule[5]))
            database.add_rule(rule_input, is_initial_rule=True)
            rule_id += 1

        # The ContractLogicError is thrown when the call to the contract is reverted with Rule__NonExistent.
        except exceptions.ContractLogicError as e:
            logging.info('data', e.data)
            stop_fetching_rules = True

