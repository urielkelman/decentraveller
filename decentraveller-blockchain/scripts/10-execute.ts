import { ethers } from "hardhat";
import { Decentraveller, DecentravellerGovernance } from "../typechain-types";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const main = async () => {
    const user = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);

    const decentraveller: Decentraveller = await ethers.getContract(
        "Decentraveller",
        user
    );
    const decentravellerGovernanceC: DecentravellerGovernance =
        await ethers.getContract("DecentravellerGovernance", user);
    const decentravellerGovernance: DecentravellerGovernance =
        decentravellerGovernanceC;

    const approveTxCalldata = (
        await decentraveller.populateTransaction.approveProposedRule(3)
    ).data!;
    const proposalHash = ethers.utils.id("New rule for Decentraveller!");

    await decentravellerGovernance[
        "execute(address[],uint256[],bytes[],bytes32)"
    ]([decentraveller.address], [0], [approveTxCalldata], proposalHash);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
