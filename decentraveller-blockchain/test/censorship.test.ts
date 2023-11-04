import { deployments, getNamedAccounts, ethers } from "hardhat";
import { expect, assert } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
    Decentraveller,
    DecentravellerReview,
    DecentravellerToken,
} from "../typechain-types";
import { Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Decentraveller censorship", function () {
    let decentraveller: Decentraveller;
    let userSigner: Signer;
    let secondUserSigner: Signer;
    let thirdUserSigner: Signer;
    let fourthUserSigner: Signer;
    let signers: SignerWithAddress[];
    let reviewAddress: string;
    let review: DecentravellerReview;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user, secondUser, thirdUser, fourthUser } =
            await getNamedAccounts();
        userSigner = await ethers.getSigner(user);
        secondUserSigner = await ethers.getSigner(secondUser);
        thirdUserSigner = await ethers.getSigner(thirdUser);
        fourthUserSigner = await ethers.getSigner(fourthUser);

        decentraveller = await ethers.getContract("Decentraveller", user);

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

        await decentraveller.addPlace(
            "Eretz",
            "34.3",
            "32.1",
            "Malabia 1322",
            1
        );
        await decentraveller
            .connect(secondUserSigner)
            .addReview(
                1,
                "Best place to eat israeli food",
                ["image_1", "image_2"],
                5
            );

        signers = (await ethers.getSigners()).slice(0, 10);
        const { tokenMinter } = await getNamedAccounts();
        const decentravellerToken: DecentravellerToken =
            await ethers.getContract("DecentravellerToken", tokenMinter);

        for (const signer of signers) {
            decentravellerToken.rewardNewPlace(signer.address);
        }

        reviewAddress = await decentraveller.getReviewAddress(1, 1);

        review = await ethers.getContractAt(
            "DecentravellerReview",
            reviewAddress,
            userSigner
        );
    });

    it("should not allow non admin user to censor review", async function () {
        await expect(
            decentraveller.connect(fourthUserSigner).censorReview(1, 1, 1)
        ).to.be.revertedWithCustomError(
            decentraveller,
            "OnlyModerator__Execution"
        );
    });

    it("should allow moderator to censor review and emit event", async function () {
        await expect(
            decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1)
        )
            .to.emit(decentraveller, "DecentravellerReviewCensored")
            .withArgs(1, 1, 1, await thirdUserSigner.getAddress());

        const reviewState = await review.getState();

        assert.equal(reviewState, 1);
    });

    it("should not allow a review to be censored twice", async function () {
        await decentraveller.censorReview(1, 1, 1);

        await expect(
            decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1)
        )
            .to.be.revertedWithCustomError(
                review,
                "Review__BadStateForOperation"
            )
            .withArgs(1);
    });

    it("should not allow a review censorship to be challenged by a user that is not the review owner", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);

        await expect(
            decentraveller
                .connect(fourthUserSigner)
                .challengeReviewCensorship(1, 1)
        ).to.be.revertedWithCustomError(review, "OnlyReviewOwner__Execution");
    });

    it("should not allow to challenge a review that is not in censored state", async function () {
        await expect(
            decentraveller
                .connect(secondUserSigner)
                .challengeReviewCensorship(1, 1)
        )
            .to.be.revertedWithCustomError(
                review,
                "Review__BadStateForOperation"
            )
            .withArgs(0);
    });

    it("should emit event and change review status when censorship is challenged", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);

        await expect(
            decentraveller
                .connect(secondUserSigner)
                .challengeReviewCensorship(1, 1)
        )
            .to.emit(decentraveller, "DecentravellerReviewCensorshipChallenged")
            .withArgs(
                1,
                1,
                (await ethers.provider.getBlock("latest")).timestamp +
                    86400 +
                    // We have to add 1 second since the value of the timestamp is calculated before the call.
                    1,
                anyValue
            );

        const reviewStatus = await review.getState();

        assert.equal(reviewStatus, 2);
    });

    it("should not allow a review to be challenged twice", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        await expect(
            decentraveller
                .connect(secondUserSigner)
                .challengeReviewCensorship(1, 1)
        )
            .to.be.revertedWithCustomError(
                review,
                "Review__BadStateForOperation"
            )
            .withArgs(2);
    });

    it("should allow a voter to vote only once in a non expired challenge", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        const juries = await review.getJuries();

        const signerToVote = signers.find(
            (signer) => signer.address == juries[0]
        )!;

        await review.connect(signerToVote).voteAgainstCensorship();

        const votes = await review.getChallengeVotingResults();
        const votesFor = votes[0];
        const votesAgainst = votes[1];

        assert.equal(votesFor, 0);
        assert.equal(votesAgainst, 1);
        assert.equal(await review.getState(), 2);
    });

    it("should show a challenge was lost when quorum is not met and voting reaches deadline", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        const juries = await review.getJuries();

        const signerToVote = signers.find(
            (signer) => signer.address == juries[0]
        )!;
        const secondSignerToVote = signers.find(
            (signer) => signer.address == juries[1]
        )!;

        await review.connect(signerToVote).voteAgainstCensorship();
        await review.connect(secondSignerToVote).voteAgainstCensorship();

        await time.increase(await review.CHALLENGE_PERIOD());

        assert.equal(await review.getState(), 4);
    });

    it("should show that the challenge was lost when absolute majority vote for censorship", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        const juries = await review.getJuries();

        const signerToVote = signers.find(
            (signer) => signer.address == juries[0]
        )!;
        const secondSignerToVote = signers.find(
            (signer) => signer.address == juries[1]
        )!;
        const thirdSignerToVote = signers.find(
            (signer) => signer.address == juries[2]
        )!;
        const fourthSignerToVote = signers.find(
            (signer) => signer.address == juries[3]
        )!;

        await review.connect(signerToVote).voteAgainstCensorship();
        await review.connect(secondSignerToVote).voteForCensorship();
        await review.connect(thirdSignerToVote).voteForCensorship();

        assert.equal(await review.getState(), 2);

        await review.connect(fourthSignerToVote).voteForCensorship();

        assert.equal(await review.getState(), 4);
    });

    it("should show that the challenge was won when quorum is met, deadline is reached, and simple majority is accomplished", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        const juries = await review.getJuries();

        const signerToVote = signers.find(
            (signer) => signer.address == juries[0]
        )!;
        const secondSignerToVote = signers.find(
            (signer) => signer.address == juries[1]
        )!;
        const thirdSignerToVote = signers.find(
            (signer) => signer.address == juries[2]
        )!;

        await review.connect(signerToVote).voteAgainstCensorship();
        await review.connect(secondSignerToVote).voteAgainstCensorship();
        await review.connect(thirdSignerToVote).voteForCensorship();

        await time.increase(await review.CHALLENGE_PERIOD());

        assert.equal(await review.getState(), 3);
    });

    it("should not allow executing uncensorhip in defeated challenge", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        const juries = await review.getJuries();

        const signerToVote = signers.find(
            (signer) => signer.address == juries[0]
        )!;
        const secondSignerToVote = signers.find(
            (signer) => signer.address == juries[1]
        )!;
        const thirdSignerToVote = signers.find(
            (signer) => signer.address == juries[2]
        )!;

        await review.connect(signerToVote).voteAgainstCensorship();
        await review.connect(secondSignerToVote).voteForCensorship();
        await review.connect(thirdSignerToVote).voteForCensorship();

        await time.increase(await review.CHALLENGE_PERIOD());

        await expect(
            decentraveller
                .connect(secondUserSigner)
                .executeReviewUncensorship(1, 1)
        )
            .to.be.revertedWithCustomError(
                review,
                "Review__BadStateForOperation"
            )
            .withArgs(4);
    });

    it("should allow executing uncebsorship when challenge is won by absolute majority", async function () {
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);
        await decentraveller
            .connect(secondUserSigner)
            .challengeReviewCensorship(1, 1);

        const juries = await review.getJuries();

        const signerToVote = signers.find(
            (signer) => signer.address == juries[0]
        )!;
        const secondSignerToVote = signers.find(
            (signer) => signer.address == juries[1]
        )!;
        const thirdSignerToVote = signers.find(
            (signer) => signer.address == juries[2]
        )!;

        await review.connect(signerToVote).voteAgainstCensorship();
        await review.connect(secondSignerToVote).voteAgainstCensorship();
        await review.connect(thirdSignerToVote).voteAgainstCensorship();

        await expect(
            decentraveller
                .connect(secondUserSigner)
                .executeReviewUncensorship(1, 1)
        )
            .to.emit(decentraveller, "DecentravellerReviewUncensored")
            .withArgs(1, 1);

        assert.equal(await review.getState(), 5);
    });
});
