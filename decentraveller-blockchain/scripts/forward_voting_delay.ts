import { ethers, getNamedAccounts } from "hardhat";
import { DecentravellerGovernance } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";

const main = async () => {
    const { deployer } = await getNamedAccounts();

    const decentravellerGovernanceC: DecentravellerGovernance = await ethers.getContractAt(
        "DecentravellerGovernance",
        "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
        deployer
    );
    const decentravellerGovernance: DecentravellerGovernance =
        decentravellerGovernanceC;


    const votingDelay = (await decentravellerGovernance.votingDelay()).toNumber();
    await time.increase(votingDelay + 1);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
