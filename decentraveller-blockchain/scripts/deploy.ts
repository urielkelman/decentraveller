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
    const DecentravellerFactory = await ethers.getContractFactory(
        "Decentraveller"
    );
    console.log("Deploying decentraveller contract");
    const decentraveller = await DecentravellerFactory.deploy();
    await decentraveller.deployed();
    console.log(`Deployed contract address ${decentraveller.address}`);
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        // We wait for a few blocks to be mined so the scanner can index the transaction.
        await decentraveller.deployTransaction.wait(5);
        await verify(decentraveller.address, []);
    }

    /*const transactionResponse = await decentraveller.addPlace(
        "Shami Shawarma",
        0,
        "33.46",
        "-54.35"
    );

    await transactionResponse.wait(1);

    console.log("Review hash is: ", transactionResponse.hash);

    const addReviewTx = decentraveller.addReview(
        "Shami Shawarma",
        "El mejor lugar para comer shawarma"
    );

    const shamiShawarmaPlace = await decentraveller.getReviews(
        "Shami Shawarma"
    );
    console.log(shamiShawarmaPlace);*/
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
