import { ethers } from "hardhat";
import { DecentravellerGovernance } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const main = async () => {
    const user = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);
    const decentravellerGovernanceC: DecentravellerGovernance =
        await ethers.getContract("DecentravellerGovernance", user);
    const decentravellerGovernance: DecentravellerGovernance =
        decentravellerGovernanceC;

    // Increase the evm time to start voting.
    const votingDelay = await decentravellerGovernance.votingDelay();
    await time.increase(votingDelay.add(1));
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
