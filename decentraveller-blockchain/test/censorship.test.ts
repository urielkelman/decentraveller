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

        decentraveller.registerProfile("Messi", "AR", "0");
        decentraveller
            .connect(secondUserSigner)
            .registerProfile("Neymar", "BR", "1");
        decentraveller
            .connect(thirdUserSigner)
            .registerProfile("Suarez", "UY", "2");
        decentraveller
            .connect(fourthUserSigner)
            .registerProfile("Di Maria", "AR", "1");

        decentraveller.addPlace("Eretz", "34.3", "32.1", "Malabia 1322", 1);
        decentraveller
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
});
