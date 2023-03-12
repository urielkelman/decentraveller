import { ethers, run, network } from "hardhat";
import { Decentraveller } from "../typechain-types";

const main = async () => {
    const decentravellerContract: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
    );

    const result = await decentravellerContract.addPlace(
        "Shami shawarma",
        "25.3232",
        "23.321",
        "Sanfe Fe 3173",
        0
    );

    await result.wait(1);

    console.log(result);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
