import WalletConnect from "@walletconnect/client";
import {decentravellerMainContract} from "./contracts";


class BlockchainAdapter {
    async createRegisterUserTransaction(
        connector: WalletConnect,
        nickname: string,
        country: string,
        interest: string,
        onError: () => void
    ): Promise<string> {return "transactionHashConfirmed"}

}

const mockBlockchainAdapter = new BlockchainAdapter();

export { mockBlockchainAdapter };
