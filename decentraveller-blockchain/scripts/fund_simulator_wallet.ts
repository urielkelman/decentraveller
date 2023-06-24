import { ethers } from "hardhat";

const SIMULATOR_WALLET_ADDRESS = "0x0BF8367F0E7C00813AEf31f7b19d60e54b7033b2";

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
