import '@ethersproject/shims';
import { ethers } from 'ethers';
import { ContractFunction, DecentravellerContract } from './contractTypes';
import { Blockchain, BlockchainByChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { withTimeout } from '../commons/functions/utils';
import { DEFAULT_CHAIN_ID } from '../context/AppContext';
import { decentravellerPlaceContract } from './contracts/decentravellerPlaceContract';
import { decentravellerMainContract } from './contracts/decentravellerMainContract';

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
            web3Provider
        );
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        const connectedSigner = web3Provider.getSigner();

        return await withTimeout(
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
            BLOCKCHAIN_TRANSACTION_TASK_NAME
        );
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
        onErrorAddingPlace: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                web3Provider,
                decentravellerMainContract,
                'addPlace',
                placeName,
                latitude,
                longitude,
                physicalAddress,
                placeCategory
            );
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
        onError: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                web3Provider,
                decentravellerMainContract,
                'registerProfile',
                nickname,
                country,
                interest
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
        images: string[]
    ): Promise<string> {
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
        const contractFunction: ContractFunction = decentravellerMainContract.functions['getPlaceAddress'];
        const mainContractAddress: string = decentravellerMainContract.addressesByBlockchain[blockchain];
        const decentravellerMain = new ethers.Contract(
            mainContractAddress,
            contractFunction.fullContractABI,
            web3Provider
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
                rating
            );
        } catch (e) {
            console.log(e);
        }
    }
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
