import { ethers } from "hardhat";

//const SIMULATOR_WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";
//const SIMULATOR_WALLET_ADDRESS = "0x1C48e99E1de65A9D005A8C07933863569e34CeCB";
const SIMULATOR_WALLET_ADDRESS = "0x534db61F377a4493E550b0AFCcf002e031A230dd";

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
