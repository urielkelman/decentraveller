import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { Decentraveller, Decentraveller__factory } from "../typechain-types";

describe("Decentraveller", function () {
    let decentravellerFactory: Decentraveller__factory;
    let decentraveller: Decentraveller;
    // let
    beforeEach(async function () {
        decentravellerFactory = await ethers.getContractFactory(
            "Decentraveller"
        );
        decentraveller = await decentravellerFactory.deploy();
    });

    it("Should start with placeId 0", async function () {
        const currentPlaceId = await decentraveller.lastPlaceId();
        assert.equal(currentPlaceId.toString(), "0");
    });

    it("Should increment placeId when we save a new place", async function () {
        const addPlaceResponse = decentraveller.addPlace(
            "Shami Shawarma",
            0,
            "33.46",
            "-54.35"
        );

        const currentPlaceId = await decentraveller.lastPlaceId();
        assert.equal(currentPlaceId.toString(), "1");
    });
});
