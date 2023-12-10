import { ethers, getNamedAccounts } from "hardhat";
import { DecentravellerToken } from "../typechain-types";

//const SIMULATOR_WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";
//const SIMULATOR_WALLET_ADDRESS = "0x1C48e99E1de65A9D005A8C07933863569e34CeCB";
const SIMULATOR_WALLET_ADDRESS = "0x534db61F377a4493E550b0AFCcf002e031A230dd";

const main = async () => {
    const { tokenOwner, tokenMinter } = await getNamedAccounts();

    const decentravellerToken: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        "0x057ef64e23666f000b34ae31332854acbd1c8544",
        tokenOwner
    );

    const tokenMinterSigner = await ethers.getSigner(tokenMinter);
    for (let i = 0; i < 110; i++) {
        var rewardWithTokensTx = await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(SIMULATOR_WALLET_ADDRESS);
        await rewardWithTokensTx.wait();
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
