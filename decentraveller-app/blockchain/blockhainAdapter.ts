import '@ethersproject/shims';
import { ethers } from 'ethers';
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';
import { withTimeout } from '../commons/functions/utils';
import { JSON_RPC_URL } from '../api/config';
import { DEFAULT_CHAIN_ID } from '../context/AppContext';

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 30000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction';

class BlockchainAdapter {
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
        contract: DecentravellerContract,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        const ethersProvider: ethers.providers.Provider = this.getProvider(DEFAULT_CHAIN_ID);
        const blockchain: Blockchain = BlockchainByConnectorChainId[DEFAULT_CHAIN_ID];
        const contractAddress: string = contract.addressesByBlockchain[blockchain];
        const contractFunction: ContractFunction = contract.functions[functionName];
        const ethersContract: ethers.Contract = new ethers.Contract(
            contractAddress,
            contractFunction.fullContractABI,
            ethersProvider
        );
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        //const connectedAccount: string = connector.accounts[0];
        return await withTimeout(
            async () => {
                console.log('send transaction');
                /*const transactionHash: string = await connector.sendTransaction({
                    from: connectedAccount,
                    to: contractAddress,
                    data: populatedTransaction.data,
                });
                console.log(transactionHash);
                const txReceipt = await ethersProvider.waitForTransaction(transactionHash);
                if (txReceipt.status === 0) {
                    console.log(txReceipt);
                    throw new Error('An exception happened during transaction execution.');
                }
                return transactionHash;*/
            },
            BLOCKCHAIN_TIMEOUT_IN_MILLIS,
            BLOCKCHAIN_TRANSACTION_TASK_NAME
        );
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
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
