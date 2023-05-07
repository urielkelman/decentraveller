import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';

class BlockchainAdapter {
    private async getProvider(chainId: number): Promise<ethers.providers.Provider> {
        if (chainId === LOCAL_DEVELOPMENT_CHAIN_ID) {
            return new ethers.providers.JsonRpcProvider('http://10.0.2.2:8545/');
        } else {
            return ethers.getDefaultProvider(chainId);
        }
    };

    private async populateAndSend(
        connector: WalletConnect,
        contract: DecentravellerContract,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        const provider: ethers.providers.Provider = await this.getProvider(connector.chainId);
        console.log(connector.chainId)
        const blockchain: Blockchain = BlockchainByConnectorChainId[connector.chainId];
        console.log("b", blockchain)
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
        const transactionHash: string = await connector.sendTransaction({
            from: connectedAccount,
            to: contractAddress,
            data: populatedTransaction.data,
        });

        await provider.waitForTransaction(transactionHash);

        return transactionHash;
    };

    async createAddNewPlaceTransaction (
        connector: WalletConnect,
        placeName: string,
        latitude: string,
        longitude: string,
        physicalAddress: string,
        placeCategory: number
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
        }
    };
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
