import { deployments, getNamedAccounts, ethers } from "hardhat";
import { expect, assert } from "chai";
import { Decentraveller } from "../typechain-types";
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
            .withArgs(1, 1, 1);
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
        ).to.be.revertedWithCustomError(review, "Review__AlreadyCensored");
    });
});
