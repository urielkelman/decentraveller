import { ethers, getNamedAccounts } from "hardhat";
import { DecentravellerGovernance } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
    await time.increase(1 * 24 * 60 * 60);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
