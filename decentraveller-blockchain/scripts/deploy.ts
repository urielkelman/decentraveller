import { ethers } from "hardhat";

const main = async () => {
    const DecentravellerFactory = await ethers.getContractFactory(
        "Decentraveller"
    );
    console.log("Deploying decentraveller contract");
    const decentraveller = await DecentravellerFactory.deploy();
    await decentraveller.deployed();
    console.log(`Deployed contract address ${decentraveller.address}`);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
