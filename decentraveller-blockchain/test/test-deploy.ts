import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { expect, assert } from "chai";
import {
    Decentraveller,
    DecentravellerPlace,
    DecentravellerPlaceCloneFactory,
    DecentravellerPlaceCloneFactory__factory,
    DecentravellerPlace__factory,
    Decentraveller__factory,
} from "../typechain-types";

describe("Decentraveller", function () {
    let decentravellerPlaceFactory: DecentravellerPlace__factory;
    let decentravellerPlaceCloneFactoryFactory: DecentravellerPlaceCloneFactory__factory;
    let decentravellerFactory: Decentraveller__factory;
    let decentraveller: Decentraveller;
    let decentravellerPlaceImplementation: DecentravellerPlace;
    let decentravellerPlaceCloneFactory: DecentravellerPlaceCloneFactory;
    // let
    beforeEach(async function () {
        decentravellerPlaceFactory = await ethers.getContractFactory(
            "DecentravellerPlace"
        );
        decentravellerPlaceCloneFactoryFactory =
            await ethers.getContractFactory("DecentravellerPlaceCloneFactory");
        decentravellerFactory = await ethers.getContractFactory(
            "Decentraveller"
        );
        decentravellerPlaceImplementation =
            await decentravellerPlaceFactory.deploy();
        decentravellerPlaceCloneFactory =
            await decentravellerPlaceCloneFactoryFactory.deploy(
                decentravellerPlaceImplementation.address
            );
        decentraveller = await decentravellerFactory.deploy(
            decentravellerPlaceCloneFactory.address
        );
    });

    it("Should start with placeId 0", async function () {
        const currentPlaceId = await decentraveller.lastPlaceId();
        assert.equal(currentPlaceId.toString(), "0");
    });

    it("Should increment placeId after saving a new place", async function () {
        decentraveller.addPlace("Shami shawarma", "Gastronomic", "35", "23");

        const currentPlaceId = await decentraveller.lastPlaceId();
        assert.equal(currentPlaceId.toString(), "1");
    });

    it("Should be able to add new reviews to place and retrieve them", async function () {
        decentraveller.addPlace("Shami shawarma", "Gastronomic", "35", "23");

        const addedPlaceId = await decentraveller.lastPlaceId();

        // This is absolutely fake.
        decentraveller.addReview(addedPlaceId, "Best place to eat shawarma.");

        const reviews: string[] = await decentraveller.getReviews(addedPlaceId);

        assert.equal(reviews.length, 1);
        assert.equal(reviews[0], "Best place to eat shawarma.");
    });
});
