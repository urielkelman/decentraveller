import '@ethersproject/shims';
import { ethers } from 'ethers';
<<<<<<< HEAD
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { withTimeout } from '../commons/functions/utils';
import { JSON_RPC_URL } from '../api/config';
=======
import { decentravellerMainContract } from './contracts/decentravellerMainContract';
import { Blockchain, BlockchainByChainId } from './config';
import { ContractFunction, DecentravellerContract } from './contracts/common';
import { decentravellerPlaceContract } from './contracts/decentravellerPlaceContract';
import { withTimeout } from '../commons/functions/utils';
>>>>>>> main
import { DEFAULT_CHAIN_ID } from '../context/AppContext';

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 100000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction';

class BlockchainAdapter {
<<<<<<< HEAD
    private getProvider(chainId: number): ethers.providers.Provider {
        if (chainId === LOCAL_DEVELOPMENT_CHAIN_ID || chainId === 0) {
            return new ethers.providers.JsonRpcProvider(JSON_RPC_URL);
        } else {
            console.log('asd');
            return ethers.getDefaultProvider(chainId);
        }
    }

    private async populateAndSend(
        wcProvider,
=======
    private async populateAndSendWithAddress(
        web3Provider: ethers.providers.Web3Provider,
>>>>>>> main
        contract: DecentravellerContract,
        functionName: string,
        contractAddress: string,
        ...args: unknown[]
    ): Promise<string> {
<<<<<<< HEAD
        const ethersProvider: ethers.providers.Provider = this.getProvider(DEFAULT_CHAIN_ID);
        const blockchain: Blockchain = BlockchainByConnectorChainId[DEFAULT_CHAIN_ID];
        const contractAddress: string = contract.addressesByBlockchain[blockchain];
=======
>>>>>>> main
        const contractFunction: ContractFunction = contract.functions[functionName];
        const ethersContract: ethers.Contract = new ethers.Contract(
            contractAddress,
            contractFunction.fullContractABI,
<<<<<<< HEAD
            ethersProvider
=======
            web3Provider
>>>>>>> main
        );
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
<<<<<<< HEAD
        //const connectedAccount: string = connector.accounts[0];
        return await withTimeout(
            async () => {
                console.log('send transaction');
                /*const transactionHash: string = await connector.sendTransaction({
                    from: connectedAccount,
=======
        const connectedSigner = web3Provider.getSigner();
        return await withTimeout(
            async () => {
                const txResponse: ethers.providers.TransactionResponse = await connectedSigner.sendTransaction({
>>>>>>> main
                    to: contractAddress,
                    data: populatedTransaction.data,
                    chainId: DEFAULT_CHAIN_ID,
                });
<<<<<<< HEAD
                console.log(transactionHash);
                const txReceipt = await ethersProvider.waitForTransaction(transactionHash);
=======
                const txReceipt = await txResponse.wait();
>>>>>>> main
                if (txReceipt.status === 0) {
                    console.log(txReceipt);
                    throw new Error('An exception happened during transaction execution.');
                }
<<<<<<< HEAD
                return transactionHash;*/
=======
                return txResponse.hash;
>>>>>>> main
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
<<<<<<< HEAD
        provider,
=======
        web3Provider: ethers.providers.Web3Provider,
>>>>>>> main
        placeName: string,
        latitude: string,
        longitude: string,
        physicalAddress: string,
        placeCategory: number,
        onErrorAddingPlace: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
<<<<<<< HEAD
                provider,
=======
                web3Provider,
>>>>>>> main
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
<<<<<<< HEAD
        provider,
=======
        web3Provider: ethers.providers.Web3Provider,
>>>>>>> main
        nickname: string,
        country: string,
        interest: string,
        onError: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
<<<<<<< HEAD
                provider,
=======
                web3Provider,
>>>>>>> main
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
