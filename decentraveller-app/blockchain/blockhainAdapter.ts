import '@ethersproject/shims';
import { ethers } from 'ethers';
import { ContractFunction, DecentravellerContract } from './contractTypes';
import { Blockchain, BlockchainByChainId } from './config';
import { withTimeout } from '../commons/functions/utils';
import { DEFAULT_CHAIN_ID } from '../context/AppContext';
import { decentravellerPlaceContract } from './contracts/decentravellerPlaceContract';
import { decentravellerMainContract } from './contracts/decentravellerMainContract';
import { decentravellerPlaceFactoryContract } from './contracts/decentravellerPlaceFactoryABI';
import { BlockchainProposalStatus } from './types';
import { decentravellerGovernanceContract } from './contracts/decentravellerGovernanceContract';

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 100000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction';

class BlockchainAdapter {
    private async populateAndSendWithAddress(
        web3Provider: ethers.providers.Web3Provider,
        contract: DecentravellerContract,
        functionName: string,
        contractAddress: string,
        ...args: unknown[]
    ): Promise<string> {
        const contractFunction: ContractFunction = contract.functions[functionName];
        const ethersContract: ethers.Contract = new ethers.Contract(
            contractAddress,
            contractFunction.fullContractABI,
            web3Provider,
        );

        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        const connectedSigner = web3Provider.getSigner();

        return (await withTimeout(
            async () => {
                const txResponse: ethers.providers.TransactionResponse = await connectedSigner.sendTransaction({
                    to: contractAddress,
                    data: populatedTransaction.data,
                    chainId: DEFAULT_CHAIN_ID,
                });

                const txReceipt = await txResponse.wait();
                if (txReceipt.status === 0) {
                    console.log(txReceipt);
                    throw new Error('An exception happened during transaction execution.');
                }
                return txResponse.hash;
            },
            BLOCKCHAIN_TIMEOUT_IN_MILLIS,
            BLOCKCHAIN_TRANSACTION_TASK_NAME,
        )) as Promise<string>;
    }

    private async populateAndSend(
        web3Provider: ethers.providers.Web3Provider,
        contract: DecentravellerContract,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
        const contractAddress: string = contract.addressesByBlockchain[blockchain];
        return this.populateAndSendWithAddress(web3Provider, contract, functionName, contractAddress, ...args);
    }

    async createAddNewPlaceTransaction(
        web3Provider: ethers.providers.Web3Provider,
        placeName: string,
        latitude: string,
        longitude: string,
        physicalAddress: string,
        placeCategory: number,
        onErrorAddingPlace: () => void,
    ): Promise<number> {
        try {
            const transactionHash: string = await this.populateAndSend(
                web3Provider,
                decentravellerMainContract,
                'addPlace',
                placeName,
                latitude,
                longitude,
                physicalAddress,
                placeCategory,
            );

            const txReceipt = await web3Provider.getTransactionReceipt(transactionHash);
            const contract = new ethers.Contract(
                decentravellerPlaceFactoryContract.addressesByBlockchain[BlockchainByChainId[DEFAULT_CHAIN_ID]],
                decentravellerPlaceFactoryContract.fullContractABI,
                web3Provider,
            );
            txReceipt.logs.forEach((log) => {
                try {
                    const parsedLog = contract.interface.parseLog(log);
                    console.log(parsedLog);
                    if (parsedLog.name === 'NewPlace') {
                        return parsedLog.args[0];
                    }
                } catch (error) {
                    // This means the log didn't belong to the contract, skip
                }
            });
            console.log(txReceipt);
            return 1;
        } catch (e) {
            console.log(e);
            onErrorAddingPlace();
        }
    }

    async createRegisterUserTransaction(
        web3Provider: ethers.providers.Web3Provider,
        nickname: string,
        country: string,
        interest: string,
        onError: () => void,
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                web3Provider,
                decentravellerMainContract,
                'registerProfile',
                nickname,
                country,
                interest,
            );
        } catch (e) {
            console.log(e);
            onError();
        }
    }

    async addPlaceReviewTransaction(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        comment: string,
        rating: number,
        images: string[],
    ): Promise<string> {
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
        const contractFunction: ContractFunction = decentravellerMainContract.functions['getPlaceAddress'];
        const mainContractAddress: string = decentravellerMainContract.addressesByBlockchain[blockchain];
        const decentravellerMain = new ethers.Contract(
            mainContractAddress,
            contractFunction.fullContractABI,
            web3Provider,
        );
        const placeAddress = await decentravellerMain.getPlaceAddress(placeId);
        try {
            return await this.populateAndSendWithAddress(
                web3Provider,
                decentravellerPlaceContract,
                'addReview',
                placeAddress,
                comment,
                images,
                rating,
            );
        } catch (e) {
            console.log(e);
        }
    }

    async getProposalState(
        web3Provider: ethers.providers.Web3Provider,
        proposalId: string,
    ): Promise<BlockchainProposalStatus> {
        try {
            const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
            const contractFunction: ContractFunction = decentravellerGovernanceContract.functions['state'];

            const governanceAddress: string = decentravellerGovernanceContract.addressesByBlockchain[blockchain];
            const decentravellerGovernance = new ethers.Contract(
                governanceAddress,
                contractFunction.fullContractABI,
                web3Provider,
            );
            return await decentravellerGovernance.state(proposalId);
        } catch (e) {
            console.log(e);
        }
    }

    async hasVotedInProposal(
        web3Provider: ethers.providers.Web3Provider,
        proposalId: string,
        address: string,
    ): Promise<boolean> {
        try {
            const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
            const governanceAddress: string = decentravellerGovernanceContract.addressesByBlockchain[blockchain];
            const decentravellerGovernance = new ethers.Contract(
                governanceAddress,
                decentravellerGovernanceContract.fullContractABI,
                web3Provider,
            );
            return await decentravellerGovernance.hasVoted(proposalId, address);
        } catch (e) {
            console.log(e);
        }
    }

    async proposeNewRule(web3Provider: ethers.providers.Web3Provider, ruleStatement: string): Promise<string> {
        try {
            return await this.populateAndSend(
                web3Provider,
                decentravellerMainContract,
                'createNewRuleProposal',
                ruleStatement,
            );
        } catch (e) {
            console.log(e);
        }
    }

    async voteInProposal(
        web3Provider: ethers.providers.Web3Provider,
        proposalId: string,
        voteValue: number,
    ): Promise<string> {
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
        const governanceAddress: string = decentravellerGovernanceContract.addressesByBlockchain[blockchain];
        try {
            return await this.populateAndSendWithAddress(
                web3Provider,
                decentravellerGovernanceContract,
                'castVote',
                governanceAddress,
                proposalId,
                voteValue,
            );
        } catch (e) {
            console.log(e);
        }
    }

    private async executeProposalAction(
        web3Provider: ethers.providers.Web3Provider,
        targetContractAddress: string,
        txCalldata: string,
        proposalHash: string,
        proposalAction: string,
    ): Promise<string> {
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
        const governanceAddress: string = decentravellerGovernanceContract.addressesByBlockchain[blockchain];

        const governance = new ethers.Contract(
            governanceAddress,
            decentravellerGovernanceContract.fullContractABI,
            web3Provider.getSigner(),
        );

        try {
            const queueProposalTx = await governance[`${proposalAction}(address[],uint256[],bytes[],bytes32)`](
                [targetContractAddress],
                [0],
                [txCalldata],
                proposalHash,
            );
            const txReceipt = await queueProposalTx.wait();
            return txReceipt.hash;
        } catch (e) {
            console.log(e);
        }
    }

    async queueProposal(
        web3Provider: ethers.providers.Web3Provider,
        targetContractAddress: string,
        txCalldata: string,
        proposalHash: string,
    ): Promise<string> {
        return this.executeProposalAction(web3Provider, targetContractAddress, txCalldata, proposalHash, 'queue');
    }

    async executeProposal(
        web3Provider: ethers.providers.Web3Provider,
        targetContractAddress: string,
        txCalldata: string,
        proposalHash,
    ): Promise<string> {
        return this.executeProposalAction(web3Provider, targetContractAddress, txCalldata, proposalHash, 'execute');
    }
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter, BlockchainAdapter };
