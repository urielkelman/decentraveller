import { ethers, getNamedAccounts } from "hardhat";
import { Decentraveller, DecentravellerToken } from "../typechain-types";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";

const main = async () => {
    const user = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);

    const hardhatSigner = (await ethers.getSigners())[0];

    const tx = await hardhatSigner.sendTransaction({
        to: WALLET_ADDRESS,
        value: ethers.utils.parseEther("1"),
    });

    await tx.wait();

    const { tokenOwner, tokenMinter } = await getNamedAccounts();

    const decentraveller: Decentraveller = await ethers.getContract(
        "Decentraveller",
        user
    );
    await decentraveller.registerProfile("Uriztek", "AR", 1);
    const decentravellerToken: DecentravellerToken = await ethers.getContract(
        "DecentravellerToken",
        tokenOwner
    );
    const setNewRewardTx = await decentravellerToken.setNewPlacewRewardAmount(
        11
    );
    await setNewRewardTx.wait();
    const tokenMinterSigner = await ethers.getSigner(tokenMinter);
    const rewardWithTokensTx = await decentravellerToken
        .connect(tokenMinterSigner)
        .rewardNewPlace(user.address);
    await rewardWithTokensTx.wait();

    // Register proposal.
    const newRuleTx = await decentraveller.createNewRuleProposal(
        "New rule for Decentraveller!"
    );
    await newRuleTx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
