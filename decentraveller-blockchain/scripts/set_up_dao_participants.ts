import { Wallet } from "ethers";
import { Decentraveller, DecentravellerToken } from "../typechain-types";
import { ethers, getNamedAccounts } from "hardhat";

async function createAndFundUserWallets(
    decentraveller: Decentraveller,
    decentravellerToken: DecentravellerToken,
    totalWallets: number,
    shifted: number = 0
): Promise<Wallet[]> {
    const { faucet, tokenMinter } = await getNamedAccounts();
    const faucetSigner = await ethers.getSigner(faucet);
    const tokenMinterSigner = await ethers.getSigner(tokenMinter);
    const wallets: Wallet[] = [];
    for (let index = 0; index < totalWallets; index++) {
        const wallet: Wallet = ethers.Wallet.createRandom().connect(
            ethers.provider
        );
        // Fund the wallet with some ETH.
        const fundTx = await faucetSigner.sendTransaction({
            to: wallet.address,
            value: ethers.utils.parseEther("1"),
        });
        await fundTx.wait();
        // Register a profile.
        const registerProfileTx = await decentraveller
            .connect(wallet)
            .registerProfile(`User ${index + shifted}`, "AR", 1);
        await registerProfileTx.wait();
        // Give some DECT tokens to participate in votation.
        const mintDectTx = await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(wallet.address);
        await mintDectTx.wait();
        wallets.push(wallet);
    }
    return wallets;
}

export { createAndFundUserWallets };
