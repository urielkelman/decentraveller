import { ethers, getNamedAccounts } from "hardhat";
import { Decentraveller, DecentravellerToken } from "../typechain-types";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";

const MAIN_CONTRACT_ADDRESS = "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e";
const TOKEN_ADDRESS = "0x057ef64e23666f000b34ae31332854acbd1c8544";

const main = async () => {
    const walletSigner = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);
    const hardhatSigner = (await ethers.getSigners())[0];
    const decentraveller: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        MAIN_CONTRACT_ADDRESS,
        walletSigner
    );

    // Fund the wallet.
    const tx = await hardhatSigner.sendTransaction({
        to: WALLET_ADDRESS,
        value: ethers.utils.parseEther("1"),
    });
    await tx.wait();

    // Create the profile.
    const registerProfileTx = await decentraveller.registerProfile(
        "uriztek",
        "AR",
        0
    );
    await registerProfileTx.wait();

    // Assign tokens.
    const { tokenMinter } = await getNamedAccounts();
    const tokenMinterSigner = await ethers.getSigner(tokenMinter);

    const decentravellerToken: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        TOKEN_ADDRESS,
        tokenMinterSigner
    );

    await Promise.all(
        [...Array(5)].map(async () => {
            const rewardWithTokensTx = await decentravellerToken.rewardNewPlace(
                WALLET_ADDRESS
            );

            await rewardWithTokensTx.wait();
        })
    );

    // Create rule.
    const proposeRuleTx = await decentraveller.createNewRuleProposal(
        "New rule for decentraveller."
    );

    await proposeRuleTx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
