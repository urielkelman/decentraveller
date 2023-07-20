import '@ethersproject/shims';
import { ethers } from 'ethers';
import { decentravellerMainContract } from './contracts/decentravellerMainContract';
import { Blockchain, BlockchainByChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { ContractFunction, DecentravellerContract } from './contracts/common';
import { decentravellerPlaceContract } from './contracts/decentravellerPlaceContract';
import { withTimeout } from '../commons/functions/utils';
import {DEFAULT_CHAIN_ID} from "../context/AppContext";

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 10000;
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
        console.log(provider.session)
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        const connectedSigner = await web3Provider.getBlockNumber();
        console.log('connected s', connectedSigner)
        return await withTimeout(
            async () => {
                /*const network = await web3Provider.getNetwork();
                console.log('network', network)
                console.log('data', populatedTransaction.data)
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
                const {chainId} = await web3Provider.getNetwork();
                console.log(chainId)
                const amount = ethers.utils.parseEther('0.0001');
                const address = '0x0000000000000000000000000000000000000000';
                const transaction = {
                    to: address,
                    value: amount,
                    chainId,
                };

                // Send the transaction using the signer
                const txResponse = await connectedSigner.sendTransaction(transaction);
                const transactionHash = txResponse.hash;
                console.log('transactionHash is ' + transactionHash);

                // Wait for the transaction to be mined (optional)
                const receipt = await txResponse.wait();
                console.log('Transaction was mined in block:', receipt.blockNumber);*/
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
        const blockchain: Blockchain = BlockchainByChainId[DEFAULT_CHAIN_ID]
        const contractAddress: string = contract.addressesByBlockchain[blockchain];
        return this.populateAndSendWithAddress(provider, contract, functionName, contractAddress, ...args);
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
