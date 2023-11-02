import { deployments, getNamedAccounts, ethers } from "hardhat";
import { expect, assert } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
    Decentraveller,
    DecentravellerReview,
    DecentravellerToken,
} from "../typechain-types";
import { Signer } from "ethers";

describe("Decentraveller censorship", function () {
    let decentraveller: Decentraveller;
    let userSigner: Signer;
    let secondUserSigner: Signer;
    let thirdUserSigner: Signer;
    let fourthUserSigner: Signer;

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

        const reviewAddress = await decentraveller.getReviewAddress(1, 1);
        const review: DecentravellerReview = await ethers.getContractAt(
            "DecentravellerReview",
            reviewAddress,
            userSigner
        );

        const reviewState = await review.getState();

        assert.equal(reviewState, 1);
    });

    it("should not allow a review to be censored twice", async function () {
        const reviewAddress = await decentraveller.getReviewAddress(1, 1);
        const review = await ethers.getContractAt(
            "DecentravellerReview",
            reviewAddress,
            userSigner
        );
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
        const reviewAddress = await decentraveller.getReviewAddress(1, 1);
        const review = await ethers.getContractAt(
            "DecentravellerReview",
            reviewAddress,
            userSigner
        );
        await decentraveller.connect(thirdUserSigner).censorReview(1, 1, 1);

        await expect(
            decentraveller
                .connect(fourthUserSigner)
                .challengeReviewCensorship(1, 1)
        ).to.be.revertedWithCustomError(review, "OnlyReviewOwner__Execution");
    });

    it("should not allow to challenge a review that is not in censored state", async function () {
        const reviewAddress = await decentraveller.getReviewAddress(1, 1);
        const review = await ethers.getContractAt(
            "DecentravellerReview",
            reviewAddress,
            userSigner
        );

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

    it("should emit event and change review status when censorship is challegned", async function () {
        const signers = (await ethers.getSigners()).slice(0, 10);
        const { tokenMinter } = await getNamedAccounts();
        const decentravellerToken: DecentravellerToken =
            await ethers.getContract("DecentravellerToken", tokenMinter);

        for (const signer of signers) {
            decentravellerToken.rewardNewPlace(signer.address);
        }

        const reviewAddress = await decentraveller.getReviewAddress(1, 1);
        const review: DecentravellerReview = await ethers.getContractAt(
            "DecentravellerReview",
            reviewAddress,
            userSigner
        );

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
});
