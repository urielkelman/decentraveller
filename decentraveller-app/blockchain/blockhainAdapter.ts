import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import { ContractFunction, DecentravellerContract, decentravellerMainContract } from './contracts';
import { Blockchain, BlockchainByConnectorChainId } from './config';

const populateAndSend = async (
    connector: WalletConnect,
    contract: DecentravellerContract,
    functionName: string,
    ...args: unknown[]
): Promise<string> => {
    const provider: ethers.providers.Provider = ethers.getDefaultProvider(connector.chainId);
    const blockchain: Blockchain = BlockchainByConnectorChainId[connector.chainId];
    const contractAddress: string = contract.addressesByBlockchain[blockchain];
    const contractFunction: ContractFunction = contract.functions[functionName];
    console.log(contractFunction.functionABI);
    const ethersContract: ethers.Contract = new ethers.Contract(
        contractAddress,
        contractFunction.functionABI,
        provider
    );
    const populatedTransaction: ethers.PopulatedTransaction = await ethersContract.populateTransaction[
        contractFunction.functionName
    ].call(this, ...args);
    const connectedAccount: string = connector.accounts[0];
    console.log(populatedTransaction.data);
    const transactionHash = await connector.sendTransaction({
        from: connectedAccount,
        to: contractAddress,
        data: populatedTransaction.data,
    });
    return transactionHash;
};

const createAddNewPlaceTransaction = async (connector: WalletConnect, placeName: string): Promise<string> => {
    try {
        return await populateAndSend(
            connector,
            decentravellerMainContract,
            'addPlace',
            placeName,
            0,
            '33.46',
            '-54.35'
        );
    } catch (e) {
        console.log(e);
    }
};

export { createAddNewPlaceTransaction };
