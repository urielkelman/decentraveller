import '@ethersproject/shims';
import {ethers} from 'ethers';
import WalletConnect from '@walletconnect/client';
import {ContractFunction, DecentravellerContract, decentravellerMainContract} from './contracts';
import {Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID} from './config';
import {withTimeout} from '../commons/utils';

const BLOCKCHAIN_TIMEOUT_IN_MILLIS = 5000;
const BLOCKCHAIN_TRANSACTION_TASK_NAME = 'Blockchain transaction'

class BlockchainAdapter {
    private getProvider(chainId: number): ethers.providers.Provider {
        console.log('chainId', chainId);
        console.log('constante', LOCAL_DEVELOPMENT_CHAIN_ID);
        if (chainId === LOCAL_DEVELOPMENT_CHAIN_ID) {
            console.log('json provider');
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
            contractFunction.functionABI,
            provider
        );
        const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
            contractFunction.functionName
        ].call(this, ...args);
        const connectedAccount: string = connector.accounts[0];
        console.log('About to send');
        return await withTimeout(async () => {
            const transactionHash: string = await connector.sendTransaction({
                from: connectedAccount,
                to: contractAddress,
                data: populatedTransaction.data,
            });
            console.log('About to wait');
            const txReceipt = await provider.waitForTransaction(transactionHash);
            if(txReceipt.status == 0) {
                throw new Error("An exception happened during transaction execution.")
            }
            return transactionHash;
        }, BLOCKCHAIN_TIMEOUT_IN_MILLIS, BLOCKCHAIN_TRANSACTION_TASK_NAME);
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
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
