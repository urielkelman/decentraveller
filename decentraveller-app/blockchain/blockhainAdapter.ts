import '@ethersproject/shims';
import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { withTimeout } from '../commons/utils';

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

    private async populateAndSend(
        connector: WalletConnect,
        contract: DecentravellerContract,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        const provider: ethers.providers.Provider = this.getProvider(connector.chainId);
        const blockchain: Blockchain = BlockchainByConnectorChainId[connector.chainId];
        const contractAddress: string = contract.addressesByBlockchain[blockchain];
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
        comment: string,
        rating: number,
        images: string[],
    ): Promise<string> {
        try {
            return await this.populateAndSend(
                connector,
                decentravellerMainContract,
                'addReview',
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
