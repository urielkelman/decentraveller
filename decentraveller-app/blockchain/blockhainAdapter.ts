import '@ethersproject/shims';
import { ethers } from 'ethers';
import { decentravellerMainContract } from './contracts/decentravellerMainContract';
import { Blockchain, BlockchainByChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { ContractFunction, DecentravellerContract } from './contracts/common';
import { decentravellerPlaceContract } from './contracts/decentravellerPlaceContract';
import { withTimeout } from '../commons/functions/utils';
import {DEFAULT_CHAIN_ID} from "../context/AppContext";

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 30000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction';

class BlockchainAdapter {
        private async populateAndSendWithAddress(
        provider,
        contract: DecentravellerContract,
        functionName: string,
        contractAddress: string,
        ...args: unknown[]
    ): Promise<string> {
        const web3Provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(provider);
        const contractFunction: ContractFunction = contract.functions[functionName];
        const ethersContract: ethers.Contract = new ethers.Contract(
            contractAddress,
            contractFunction.fullContractABI,
            web3Provider
        );
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        const connectedSigner: ethers.providers.JsonRpcSigner = web3Provider.getSigner();
        return await withTimeout(
            async () => {
                console.log('ca', contractAddress);
                const txResponse: ethers.providers.TransactionResponse = await connectedSigner.sendTransaction({
                    to: contractAddress,
                    data: populatedTransaction.data,
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
        provider,
        contract: DecentravellerContract,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        const contractAddress: string = contract.addressesByBlockchain[DEFAULT_CHAIN_ID];
        return this.populateAndSendWithAddress(provider, contract, functionName, contractAddress, args);
    }

    async createAddNewPlaceTransaction(
        provider,
        placeName: string,
        latitude: string,
        longitude: string,
        physicalAddress: string,
        placeCategory: number,
        onErrorAddingPlace: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                provider,
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
        provider,
        nickname: string,
        country: string,
        interest: string,
        onError: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                provider,
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
        provider,
        placeId: number,
        comment: string,
        rating: number,
        images: string[]
    ): Promise<string> {
        const web3Provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(provider);
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID];
        const contractFunction: ContractFunction = decentravellerMainContract.functions['getPlaceAddress'];
        const mainContractAddress: string = decentravellerMainContract.addressesByBlockchain[blockchain];
        const decentravellerMain = new ethers.Contract(mainContractAddress, contractFunction.fullContractABI, web3Provider);
        const placeAddress = await decentravellerMain.getPlaceAddress(placeId);
        try {
            return await this.populateAndSendWithAddress(
                provider,
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
