import { ethers, deployments, getNamedAccounts } from "hardhat";
import { expect, assert } from "chai";
import {
    Decentraveller,
    DecentravellerPlaceCloneFactory,
} from "../typechain-types";

describe("Decentraveller", function () {
    let decentraveller: Decentraveller;
    let decentravellerPlaceCloneFactory: DecentravellerPlaceCloneFactory;
    let userAddress: string;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user } = await getNamedAccounts();
        userAddress = user;
        decentraveller = await ethers.getContract("Decentraveller", user);
        decentravellerPlaceCloneFactory = await ethers.getContract(
            "DecentravellerPlaceCloneFactory"
        );
    });

    it("Should start with placeId 0", async function () {
        const currentPlaceId = await decentraveller.lastPlaceId();
        assert.equal(currentPlaceId.toString(), "0");
    });

    it("Should increment placeId after saving a new place", async function () {
        await decentraveller.addPlace(
            "Shami shawarma",
            "25.3232",
            "23.321",
            "Sanfe Fe 3173",
            0
        );

        const currentPlaceId = await decentraveller.lastPlaceId();
        assert.equal(currentPlaceId.toString(), "1");
    });

    it("Should emit event on new place created", async function () {
        await expect(
            decentraveller.addPlace(
                "Shami shawarma",
                "25.3232",
                "23.321",
                "Sanfe Fe 3173",
                0
            )
        )
            .to.emit(decentravellerPlaceCloneFactory, "NewPlace")
            .withArgs(
                1,
                userAddress,
                "Shami shawarma",
                "Sanfe Fe 3173",
                0,
                "25.3232",
                "23.321"
            );

        const currentPlaceId = await decentraveller.lastPlaceId();
    });

    /* it("Should be able to add new reviews to place and retrieve them", async function () {
        await decentraveller.addPlace(
            "Shami shawarma",
            "Gastronomic",
            "35",
            "23"
        );

        const addedPlaceId = await decentraveller.lastPlaceId();

        // This is absolutely fake.
        await decentraveller.addReview(
            addedPlaceId,
            "Best place to eat shawarma."
        );

        const reviews: string[] = await decentraveller.getReviews(addedPlaceId);

        assert.equal(reviews.length, 1);
        assert.equal(reviews[0], "Best place to eat shawarma.");
    });*/
});
