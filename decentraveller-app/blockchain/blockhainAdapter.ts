import '@ethersproject/shims';
import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { withTimeout } from '../commons/functions/utils';

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 30000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction';

class BlockchainAdapter {
    private getProvider(chainId: number): ethers.providers.Provider {
        console.log(chainId)
        if (chainId === LOCAL_DEVELOPMENT_CHAIN_ID || chainId === 0)  {
            return new ethers.providers.JsonRpcProvider('https://053c-2800-40-28-198a-cc34-77b9-b3af-51f.sa.ngrok.io');
        } else {
            console.log('asd')
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
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
