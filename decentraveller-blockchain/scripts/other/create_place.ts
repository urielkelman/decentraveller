import { ethers, run, network } from "hardhat";
import { Decentraveller } from "../../typechain-types";

const main = async () => {
    const decentravellerContract: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
    );

    try {
        const result = await decentravellerContract.addPlace(
            "Shami shawarma",
            "25.3232",
            "23.321",
            "Sanfe Fe 3173",
            0
        );

        await result.wait(1);

        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
