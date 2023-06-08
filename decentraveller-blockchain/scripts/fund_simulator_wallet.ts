import { ethers } from "hardhat";

const SIMULATOR_WALLET_ADDRESS = "0x203a7dd80c3C365e5c7d56ab0611d6aF852B844c";

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
