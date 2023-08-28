import { ethers } from "hardhat";
import { Decentraveller, DecentravellerPlace } from "../typechain-types";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";

const MAIN_CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const main = async () => {
    const walletSigner = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);
    const hardhatSigner = (await ethers.getSigners())[0];
    const decentravellerContractWallet: Decentraveller =
        await ethers.getContractAt(
            "Decentraveller",
            MAIN_CONTRACT_ADDRESS,
            walletSigner
        );

    const decentravellerContractHardhat: Decentraveller =
        await ethers.getContractAt(
            "Decentraveller",
            MAIN_CONTRACT_ADDRESS,
            hardhatSigner
        );

    // Fund the wallet.
    const tx = await hardhatSigner.sendTransaction({
        to: WALLET_ADDRESS,
        value: ethers.utils.parseEther("1"),
    });
    await tx.wait();

    // Create the profiles.

    const registerHardhatProfileTx =
        await decentravellerContractHardhat.registerProfile("hardhat", "AR", 1);

    await registerHardhatProfileTx.wait();

    const registerProfileTx =
        await decentravellerContractWallet.registerProfile("uriztek", "AR", 0);
    await registerProfileTx.wait();

    // Create a place.
    const addPlaceTx = await decentravellerContractWallet.addPlace(
        "Eretz Cantina Israeli",
        "-34.5907162",
        "-58.427125",
        "Honduras 4709, Palermo, Buenos Aires, C1414, Argentina",
        0
    );
    const addPlaceTxReceipt = await addPlaceTx.wait();

    // Add review to place using hardhat wallet.
    const createdPlaceAddress = addPlaceTxReceipt.logs[0].address;
    console.log(createdPlaceAddress);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
