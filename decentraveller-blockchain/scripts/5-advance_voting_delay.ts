import { ethers, getNamedAccounts } from "hardhat";
import {
    Decentraveller,
    DecentravellerGovernance,
    DecentravellerToken,
} from "../typechain-types";
import { createAndFundUserWallets } from "./set_up_dao_participants";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { Wallet } from "ethers";

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
    await time.increase(votingDelay);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
