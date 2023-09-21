import { ethers, getNamedAccounts } from "hardhat";
import { DecentravellerGovernance } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const decentravellerGovernanceC: DecentravellerGovernance =
        await ethers.getContract("DecentravellerGovernance", deployer);
    const decentravellerGovernance: DecentravellerGovernance =
        decentravellerGovernanceC;

    // Increase the evm time to start voting.
    const votingDelay = await decentravellerGovernance.votingDelay();
    await time.increase(1000);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
