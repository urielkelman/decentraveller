import WalletConnect from '@walletconnect/client';
import { decentravellerMainContract } from './contracts/decentravellerMainContract';

class BlockchainAdapter {
    async createRegisterUserTransaction(
        connector,
        nickname: string,
        country: string,
        interest: string,
        onError: () => void
    ): Promise<string> {
        return 'transactionHashConfirmed';
    }

    async addPlaceReviewTransaction(connector, comment: string, rating: number, images: string[]): Promise<string> {
        return 'transactionHashConfirmed';
    }
}

const mockBlockchainAdapter = new BlockchainAdapter();

export { mockBlockchainAdapter };
