import { ethers, run, network } from "hardhat";

const main = async () => {
    const decentravellerContract = await ethers.getContractAt(
        "Decentraveller",
        "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    );

    const result = await decentravellerContract.addPlace(
        "Shami Shawarma",
        0,
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
