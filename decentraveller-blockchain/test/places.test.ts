import { ethers, deployments, getNamedAccounts } from "hardhat";
import { expect, assert } from "chai";
import {
    Decentraveller,
    DecentravellerPlaceCloneFactory,
    DecentravellerToken,
} from "../typechain-types";

describe("Decentraveller and places ", function () {
    let decentraveller: Decentraveller;
    let decentravellerPlaceCloneFactory: DecentravellerPlaceCloneFactory;
    let decentravellerToken: DecentravellerToken;
    let userAddress: string;

    const rewardNewPlaceTokensAmount = 2;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user } = await getNamedAccounts();
        userAddress = user;
        decentraveller = await ethers.getContract("Decentraveller", user);
        decentravellerPlaceCloneFactory = await ethers.getContract(
            "DecentravellerPlaceCloneFactory"
        );
        await decentraveller.registerProfile("Messi", "AR", 0);
        decentravellerToken = await ethers.getContract(
            "DecentravellerToken",
            user
        );
    });

    it("Should start with placeId 0", async function () {
        const currentPlaceId = await decentraveller.getCurrentPlaceId();
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
        const currentPlaceId = await decentraveller.getCurrentPlaceId();
        assert.equal(currentPlaceId.toString(), "1");
    });
    it("Should return place address of valid place id", async function () {
        const addPlaceTxResponse = await decentraveller.addPlace(
            "Shami shawarma",
            "25.3232",
            "23.321",
            "Sanfe Fe 3173",
            0
        );
        const txReceipt = await addPlaceTxResponse.wait();
        /* Tx generates two logs. First corresponds to contract creation for place */
        const createdPlaceAddress = txReceipt.logs[0].address;
        const retrievedPlaceAddress = await decentraveller.getPlaceAddress(1);
        assert.equal(retrievedPlaceAddress, createdPlaceAddress);
    });
    it("Should revert with error when trying to add a place with the same location twice", async function () {
        const addPlaceTxResponse = await decentraveller.addPlace(
            "Shami shawarma",
            "25.3232",
            "23.321",
            "Sanfe Fe 3173",
            0
        );
        await addPlaceTxResponse.wait();
        await expect(
            decentraveller.addPlace(
                "New Shawarma",
                "25.3232",
                "23.321",
                "Sanfe Fe 3173",
                0
            )
        )
            .to.be.revertedWithCustomError(
                decentraveller,
                "Place__AlreadyExistent"
            )
            .withArgs(1);
    });
    it("Should revert with error when trying to return invalid place address", async function () {
        await expect(decentraveller.getPlaceAddress(1))
            .to.be.revertedWithCustomError(decentraveller, "Place__NonExistent")
            .withArgs(1);
    });

    it("Should emit event on new place create and reward the creator with tokens", async function () {
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

        const tokenBalance = await decentravellerToken.balanceOf(userAddress);
        assert.equal(
            tokenBalance.toString(),
            rewardNewPlaceTokensAmount.toString()
        );
    });

    it("Should revert with error when trying to register a place with a non-registered address", async function () {
        const { deployer } = await getNamedAccounts();
        const deployerSigner = await ethers.getSigner(deployer);
        await expect(
            decentraveller
                .connect(deployerSigner)
                .addPlace(
                    "Shami shawarma",
                    "25.3232",
                    "23.321",
                    "Sanfe Fe 3173",
                    0
                )
        ).to.be.revertedWithCustomError(
            decentraveller,
            "Address__Unregistered"
        );
    });
});
