import { ethers, deployments, getNamedAccounts } from "hardhat";
import { expect, assert } from "chai";
import {
    Decentraveller,
    DecentravellerPlace,
    DecentravellerReviewCloneFactory,
    DecentravellerToken,
} from "../typechain-types";

const DEFAULT_MOCK_HASHES = ["0xhash1", "0xhash2", "0xhash3"];

describe("Places and Reviews", function () {
    let decentravellerPlace: DecentravellerPlace;
    let decentravellerReviewCloneFactory: DecentravellerReviewCloneFactory;
    let decentravellerToken: DecentravellerToken;
    let reviewerUserAddress: string;

    const rewardNewReviewTokensAmount = 1;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user, reviewer } = await getNamedAccounts();
        reviewerUserAddress = reviewer;
        const decentraveller: Decentraveller = await ethers.getContract(
            "Decentraveller",
            user
        );
        await decentraveller.registerProfile("Messi", "AR", 0);

        const addPlaceTxResponse = await decentraveller.addPlace(
            "Shami shawarma",
            "25.3232",
            "23.321",
            "Sanfe Fe 3173",
            0
        );

        const txReceipt = await addPlaceTxResponse.wait();
        const createdPlaceAddress = txReceipt.logs[0].address;

        decentravellerPlace = await ethers.getContractAt(
            "DecentravellerPlace",
            createdPlaceAddress,
            reviewer
        );

        decentravellerReviewCloneFactory = await ethers.getContract(
            "DecentravellerReviewCloneFactory"
        );

        decentravellerToken = await ethers.getContract(
            "DecentravellerToken",
            user
        );
    });

    it("Should start with reviewId 0", async function () {
        const currentReviewId = await decentravellerPlace.getCurrentReviewId();
        assert.equal(currentReviewId.toString(), "0");
    });

    it("Should increment id after saving a new review", async function () {
        await decentravellerPlace.addReview(
            "Amazing shawarma place",
            DEFAULT_MOCK_HASHES,
            3
        );
        const currentReviewId = await decentravellerPlace.getCurrentReviewId();
        assert.equal(currentReviewId.toString(), "1");
    });

    it("Should emit event when adding a new review and reward user with tokens", async function () {
        const placeId = await decentravellerPlace.placeId();
        await expect(
            decentravellerPlace.addReview(
                "Amazing shawarma place",
                DEFAULT_MOCK_HASHES,
                3
            )
        )
            .to.emit(decentravellerReviewCloneFactory, "NewReview")
            .withArgs(
                1,
                placeId,
                reviewerUserAddress,
                "Amazing shawarma place",
                DEFAULT_MOCK_HASHES,
                3
            );

        const tokenBalance = await decentravellerToken.balanceOf(
            reviewerUserAddress
        );
        assert.equal(
            tokenBalance.toString(),
            rewardNewReviewTokensAmount.toString()
        );
    });

    it("Should return review address of valid review id", async function () {
        const addReviewTxReponse = await decentravellerPlace.addReview(
            "Amazing shawarma place",
            DEFAULT_MOCK_HASHES,
            3
        );
        const txReceipt = await addReviewTxReponse.wait();
        const createdReviewAddress = txReceipt.logs[0].address;

        const retrievedReviewAddress =
            await decentravellerPlace.getReviewAddress(1);

        assert.equal(retrievedReviewAddress, createdReviewAddress);
    });

    it("Should revert with error when trying to return invalid review address", async function () {
        await expect(decentravellerPlace.getReviewAddress(1))
            .to.be.revertedWithCustomError(
                decentravellerPlace,
                "Review__NonExistent"
            )
            .withArgs(1);
    });

    it("Should revert with error when trying to create review with invalid score", async function () {
        await expect(
            decentravellerPlace.addReview(
                "Amazing shawarma place",
                DEFAULT_MOCK_HASHES,
                6
            )
        )
            .to.be.revertedWithCustomError(
                decentravellerPlace,
                "Review__InvalidScore"
            )
            .withArgs(6);
    });
});
