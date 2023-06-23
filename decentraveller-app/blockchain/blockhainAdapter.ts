import '@ethersproject/shims';
import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import { decentravellerMainContract } from './contracts/decentravellerMainContract';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { withTimeout } from '../commons/utils';
import { ContractFunction, DecentravellerContract } from './contracts/common';
import { decentravellerPlaceContract } from './contracts/decentravellerPlaceContract';

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 5000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction';

class BlockchainAdapter {
    private getProvider(chainId: number): ethers.providers.Provider {
        if (chainId === LOCAL_DEVELOPMENT_CHAIN_ID) {
            return new ethers.providers.JsonRpcProvider('http://10.0.2.2:8545');
        } else {
            return ethers.getDefaultProvider(chainId);
        }
    }

    private async populateAndSendWithAddress(
        connector: WalletConnect,
        contract: DecentravellerContract,
        functionName: string,
        contractAddress: string,
        ...args: unknown[]
    ): Promise<string> {
        const provider: ethers.providers.Provider = this.getProvider(connector.chainId);
        const contractFunction: ContractFunction = contract.functions[functionName];
        const ethersContract: ethers.Contract = new ethers.Contract(
            contractAddress,
            contractFunction.fullContractABI,
            provider
        );
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        const connectedAccount: string = connector.accounts[0];
        return await withTimeout(
            async () => {
                const transactionHash: string = await connector.sendTransaction({
                    from: connectedAccount,
                    to: contractAddress,
                    data: populatedTransaction.data,
                });
                const txReceipt = await provider.waitForTransaction(transactionHash);
                if (txReceipt.status === 0) {
                    console.log(txReceipt);
                    throw new Error('An exception happened during transaction execution.');
                }
                return transactionHash;
            },
            BLOCKCHAIN_TIMEOUT_IN_MILLIS,
            BLOCKCHAIN_TRANSACTION_TASK_NAME
        );
    }

    private async populateAndSend(
        connector: WalletConnect,
        contract: DecentravellerContract,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        const blockchain: Blockchain = BlockchainByConnectorChainId[connector.chainId];
        const contractAddress: string = contract.addressesByBlockchain[blockchain];
        return this.populateAndSendWithAddress(connector, contract, functionName, contractAddress, args);
    }

    async createAddNewPlaceTransaction(
        connector: WalletConnect,
        placeName: string,
        latitude: string,
        longitude: string,
        physicalAddress: string,
        placeCategory: number,
        onErrorAddingPlace: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                connector,
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
        connector: WalletConnect,
        nickname: string,
        country: string,
        interest: string,
        onError: () => void
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                connector,
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
        connector: WalletConnect,
        placeId: number,
        comment: string,
        rating: number,
        images: string[]
    ): Promise<string> {
        const provider = this.getProvider(connector.chainId);
        const blockchain: Blockchain = BlockchainByConnectorChainId[connector.chainId];
        const contractFunction: ContractFunction = decentravellerMainContract.functions['getPlaceAddress'];
        const mainContractAddress: string = decentravellerMainContract.addressesByBlockchain[blockchain];
        const decentravellerMain = new ethers.Contract(mainContractAddress, contractFunction.fullContractABI, provider);
        const placeAddress = decentravellerMain.getPlaceAddress(placeId);

        try {
            return await this.populateAndSendWithAddress(
                connector,
                decentravellerPlaceContract,
                'addReview',
                placeAddress,
                comment,
                rating,
                images
            );
        } catch (e) {
            console.log(e);
        }
    }
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
