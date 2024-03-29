import { ethers, getNamedAccounts } from "hardhat";
import { DecentravellerGovernance } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
    const { deployer } = await getNamedAccounts();

    const decentravellerGovernanceC: DecentravellerGovernance = await ethers.getContractAt(
        "DecentravellerGovernance",
        "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
        deployer
    );
    const decentravellerGovernance: DecentravellerGovernance =
        decentravellerGovernanceC;

    const votingPeriod = (await decentravellerGovernance.votingPeriod()).toNumber();
    await time.increase(votingPeriod + 1);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
