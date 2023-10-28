import { ethers } from "hardhat";
import { Decentraveller } from "../typechain-types";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const MAIN_CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const main = async () => {
    const walletSigner = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);
    const decentraveller: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        MAIN_CONTRACT_ADDRESS,
        walletSigner
    );

    const proposeRuleTx = await decentraveller.createNewRuleProposal(
        "New rule for decentraveller!"
    );

    await proposeRuleTx.wait();

    const deletionProposeTx = await decentraveller.deleteRule(1);

    await deletionProposeTx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
