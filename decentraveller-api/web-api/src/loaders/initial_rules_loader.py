import os
import json
from web3 import Web3

from src.dependencies.relational_database import build_relational_database
from src.loaders.config import contract_address_by_chain_id
from src.app import app

BLOCKCHAIN_RPC_URL = os.getenv('BLOCKCHAIN_RPC_URL')
w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_RPC_URL))
contract_address = contract_address_by_chain_id[w3.eth.chain_id]


@app.on_event("startup")
def load_initial_rules():
    with open('decentraveller_abi.json', 'r') as abi_file:
        decentraveller_contract_abi = json.load(abi_file)
    database = build_relational_database()

    decentraveller_contract = w3.eth.contract(contract_address, abi=decentraveller_contract_abi)
    stop_fetching_rules = False
    rule_id = 1
    while not stop_fetching_rules:
        rule = decentraveller_contract.functions.getRuleById(rule_id).call()
        print(rule)
        stop_fetching_rules = True






