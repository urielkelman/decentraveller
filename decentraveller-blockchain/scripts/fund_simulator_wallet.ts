import { ethers } from "hardhat";

const SIMULATOR_WALLET_ADDRESS = "0x029e8f4379943026582dd07204F5cb5F67A99074";

const main = async () => {
    const signer = (await ethers.getSigners())[0];
    const tx = await signer.sendTransaction({
        to: SIMULATOR_WALLET_ADDRESS,
        value: ethers.utils.parseEther("1"),
    });

    await tx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
