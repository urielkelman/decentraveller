import { utils } from "ethers";
import { ethers, run, network } from "hardhat";

const verify = async (contractAddress: string, args: any[]) => {
    console.log("Doing contract verification....");

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: unknown) {
        if (
            e instanceof Error &&
            e.message.toLowerCase().includes("already verified")
        ) {
            console.log("Already verified");
        } else {
            console.log(e);
        }
    }
};

const main = async () => {
    const decentravellerPlaceFactory = await ethers.getContractFactory(
        "DecentravellerPlace"
    );
    const decentravellerPlaceCloneFactoryFactory =
        await ethers.getContractFactory("DecentravellerPlaceCloneFactory");
    const decentravellerFactory = await ethers.getContractFactory(
        "Decentraveller"
    );

    const decentravellerPlaceImplementation =
        await decentravellerPlaceFactory.deploy();
    const decentravellerPlaceCloneFactory =
        await decentravellerPlaceCloneFactoryFactory.deploy(
            decentravellerPlaceImplementation.address
        );
    const decentraveller = await decentravellerFactory.deploy(
        decentravellerPlaceCloneFactory.address
    );
    await decentravellerPlaceImplementation.deployed();
    await decentravellerPlaceCloneFactory.deployed();
    await decentraveller.deployed();
    console.log(
        `Deployed place implementation contract address ${decentravellerPlaceImplementation.address}`
    );
    console.log(
        `Deployed place factory contract address ${decentravellerPlaceCloneFactory.address}`
    );
    console.log(
        `Deployed decentraveller contract address ${decentraveller.address}`
    );
    /* if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        // We wait for a few blocks to be mined so the scanner can index the transaction.
        await decentraveller.deployTransaction.wait(5);
        await verify(decentraveller.address, []);
    } */

    const provider = new ethers.providers.JsonRpcProvider();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
