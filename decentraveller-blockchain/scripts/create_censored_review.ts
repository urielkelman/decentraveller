import { ethers, getNamedAccounts } from "hardhat";
import {
    Decentraveller,
    DecentravellerReview,
    DecentravellerToken,
} from "../typechain-types";

const reviewId = 3;
const placeId = 1;

// Left = reviewId, Right = placeId
// 2	1
// 3	1
// 1	1
// 1	2
// 2	2
// 3	2
// 1	3
// 2	3
// 3	3
// 1	4

const WALLET_PRIVATE_KEY =
    "c281ee82a9174a01e75d42a16b86b506d981aee6663e1b1bc710d2a8b25d88b4";

const main = async () => {
    const testerWallet = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);

    const decentraveller: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e",
        testerWallet
    );

    const { tokenMinter } = await getNamedAccounts();
    const tokenMinterSigner = await ethers.getSigner(tokenMinter);

    const decentravellerToken: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        "0x057ef64e23666f000b34ae31332854acbd1c8544",
        tokenMinterSigner
    );

    const signers = await ethers.getSigners();

    const faucet = signers[10];
    const tx = await faucet.sendTransaction({
        to: testerWallet.address,
        value: ethers.utils.parseEther("1"),
    });

    await tx.wait();

    // await decentraveller.registerProfile("Mati", "AR", 0);

    await decentravellerToken.rewardNewPlace(testerWallet.address);

    const moderator = signers[0];

    await decentraveller.connect(moderator).censorReview(placeId, reviewId, 1);

    const reviewAddress = await decentraveller.getReviewAddress(
        placeId,
        reviewId
    );

    const review: DecentravellerReview = await ethers.getContractAt(
        "DecentravellerReview",
        reviewAddress,
        testerWallet
    );

    const reviewOwnerAddress = await review.getOwner();

    const reviewSigner = signers.find(
        (signer) => signer.address == reviewOwnerAddress
    )!;

    await decentraveller
        .connect(reviewSigner)
        .challengeReviewCensorship(placeId, reviewId);

    const juries = await review.getJuries();

    console.log("Juries: ", juries);

    const nonTesterJuries = juries.filter(
        (jury) => jury != testerWallet.address
    );

    const signerToVote = signers.find(
        (signer) => signer.address == nonTesterJuries[0]
    )!;
    const secondSignerToVote = signers.find(
        (signer) => signer.address == nonTesterJuries[1]
    )!;

    console.log(signerToVote);
    console.log(secondSignerToVote);

    await review.connect(signerToVote).voteAgainstCensorship();
    await review.connect(secondSignerToVote).voteAgainstCensorship();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
