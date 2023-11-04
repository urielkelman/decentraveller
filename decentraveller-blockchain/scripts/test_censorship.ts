import { getNamedAccounts, ethers } from "hardhat";
import {
    Decentraveller,
    DecentravellerReview,
    DecentravellerToken,
} from "../typechain-types";
import { Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
    let decentraveller: Decentraveller;
    let userSigner: Signer;
    let secondUserSigner: Signer;
    let thirdUserSigner: Signer;
    let fourthUserSigner: Signer;
    let signers: SignerWithAddress[];
    let reviewAddress: string;
    let review: DecentravellerReview;

    const { user, secondUser, thirdUser, fourthUser } =
        await getNamedAccounts();
    userSigner = await ethers.getSigner(user);
    secondUserSigner = await ethers.getSigner(secondUser);
    thirdUserSigner = await ethers.getSigner(thirdUser);
    fourthUserSigner = await ethers.getSigner(fourthUser);

    decentraveller = await ethers.getContractAt(
        "Decentraveller",
        "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e",
        user
    );

    await decentraveller.registerProfile("Messi", "AR", "0");

    await decentraveller
        .connect(secondUserSigner)
        .registerProfile("Neymar", "BR", "1");
    await decentraveller
        .connect(thirdUserSigner)
        .registerProfile("Suarez", "UY", "2");
    await decentraveller
        .connect(fourthUserSigner)
        .registerProfile("Di Maria", "AR", "1");

    await decentraveller.addPlace("Eretz", "34.3", "32.1", "Malabia 1322", 1);
    console.log(decentraveller);
    await decentraveller
        .connect(secondUserSigner)
        .addReview(1, "Best place to eat israeli food", [], 5);

    signers = (await ethers.getSigners()).slice(0, 10);
    const { tokenMinter } = await getNamedAccounts();
    const decentravellerToken: DecentravellerToken = await ethers.getContract(
        "DecentravellerToken",
        tokenMinter
    );

    for (const signer of signers) {
        decentravellerToken.rewardNewPlace(signer.address);
    }

    reviewAddress = await decentraveller.getReviewAddress(1, 1);

    review = await ethers.getContractAt(
        "DecentravellerReview",
        reviewAddress,
        userSigner
    );

    await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
    await decentraveller
        .connect(secondUserSigner)
        .challengeReviewCensorship(1, 1);

    const juries = await review.getJuries();

    const signerToVote = signers.find((signer) => signer.address == juries[0])!;
    const secondSignerToVote = signers.find(
        (signer) => signer.address == juries[1]
    )!;
    const thirdSignerToVote = signers.find(
        (signer) => signer.address == juries[2]
    )!;

    await review.connect(signerToVote).voteAgainstCensorship();
    await review.connect(secondSignerToVote).voteAgainstCensorship();
    await review.connect(thirdSignerToVote).voteAgainstCensorship();

    await decentraveller
        .connect(secondUserSigner)
        .executeReviewUncensorship(1, 1);

    console.log("review state", await review.getState());
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
