import json
import os
import logging

from web3 import Web3, exceptions

from src.dependencies.config import contract_address_by_contract_name_and_chain_id

BLOCKCHAIN_RPC_URL = os.getenv('BLOCKCHAIN_RPC_URL')

logger = logging.getLogger(__name__)


class BlockchainAdapter:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_RPC_URL))
        decentraveller_contract_address = contract_address_by_contract_name_and_chain_id['Decentraveller'][self.w3.eth.chain_id]
        decentraveller_checksum_contract_address = self.w3.to_checksum_address(decentraveller_contract_address)
        with open('src/loaders/decentraveller_abi.json', 'r') as abi_file:
            decentraveller_contract_abi = json.load(abi_file)
        self.decentraveller_contract = self.w3.eth.contract(decentraveller_checksum_contract_address, abi=decentraveller_contract_abi)

    def get_rule_by_id(self, rule_id: int):
        try:
            return self.decentraveller_contract.functions.getRuleById(rule_id).call()
        # The ContractLogicError is thrown when the call to the contract is reverted with Rule__NonExistent.
        except exceptions.ContractLogicError:
            return None
