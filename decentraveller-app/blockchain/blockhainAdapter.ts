import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId, LOCAL_DEVELOPMENT_CHAIN_ID } from './config';

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

        fetch('10.0.0.2:8000/geocoding/forward?address=Honduras&country=AR').then(r => console.log(r)).catch(e => console.log('error', e));

        const provider: ethers.providers.Provider = this.getProvider(connector.chainId);
        console.log("block number", await provider.getBlockNumber());
        console.log(connector.chainId);
        const blockchain: Blockchain = BlockchainByConnectorChainId[connector.chainId];
        console.log('b', blockchain);
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
        console.log('About to send')
        const transactionHash: string = await connector.sendTransaction({
            from: connectedAccount,
            to: contractAddress,
            data: populatedTransaction.data,
        });
        console.log('About to wait')

        await provider.waitForTransaction(transactionHash);
        console.log('se fini')

        return transactionHash;
    }

    async createAddNewPlaceTransaction(
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
    }
}

const blockchainAdapter = new BlockchainAdapter();

export { blockchainAdapter };
