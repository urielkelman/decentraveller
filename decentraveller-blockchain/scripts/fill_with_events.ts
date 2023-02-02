import { ethers, run, network } from "hardhat";

const main = async () => {
    const decentravellerContract = await ethers.getContractAt(
        "Decentraveller",
        "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
    );

    const result = await decentravellerContract.addPlace(
        "Shami Shawarma",
        "0",
        "33.46",
        "-54.35"
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
