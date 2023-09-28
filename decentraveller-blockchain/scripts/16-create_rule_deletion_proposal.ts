import { ethers } from "hardhat";
import { Decentraveller } from "../typechain-types";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";

const main = async () => {
    const user = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);

    const decentraveller: Decentraveller = await ethers.getContract(
        "Decentraveller",
        user
    );

    // Register deletion proposal.
    const deleteRuleProposalTx =
        await decentraveller.createRuleDeletionProposal(3);
    await deleteRuleProposalTx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
