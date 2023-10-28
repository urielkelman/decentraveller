import { deployments, getNamedAccounts, ethers } from "hardhat";
import { expect, assert } from "chai";
import { Decentraveller } from "../typechain-types";

describe("Decentraveller profile", function () {
    let decentraveller: Decentraveller;
    let userAddress: string;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user } = await getNamedAccounts();
        userAddress = user;
        decentraveller = await ethers.getContract("Decentraveller", user);
    });

    it("should be registered correctly and emit event", async function () {
        await expect(decentraveller.registerProfile("Uri", "AR", 0))
            .to.emit(decentraveller, "ProfileCreated")
            .withArgs(userAddress, "Uri", "AR", 0, 1);
    });

    it("should revert with error when trying to register with same address twice", async function () {
        const registerTx = await decentraveller.registerProfile("Uri", "AR", 0);
        await registerTx.wait();

        await expect(decentraveller.registerProfile("Otro Uri", "BR", 1))
            .to.be.revertedWithCustomError(
                decentraveller,
                "Profile__AlreadyCreated"
            )
            .withArgs(userAddress);
    });

    it("should revert with error when trying to register with nickname in use", async function () {
        const registerTx = await decentraveller.registerProfile("Uri", "AR", 0);
        await registerTx.wait();

        const { secondUser } = await getNamedAccounts();
        const secondUserSigner = await ethers.getSigner(secondUser);

        await expect(
            decentraveller
                .connect(secondUserSigner)
                .registerProfile("Uri", "BR", 1)
        )
            .to.be.revertedWithCustomError(
                decentraveller,
                "Profile__NicknameInUse"
            )
            .withArgs("Uri");
    });

    it("should register first users as moderators and following as normal users", async function () {
        await expect(decentraveller.registerProfile("Uri", "AR", 0))
            .to.emit(decentraveller, "ProfileCreated")
            .withArgs(userAddress, "Uri", "AR", 0, 1);

        const { secondUser } = await getNamedAccounts();
        const secondUserSigner = await ethers.getSigner(secondUser);

        await expect(
            decentraveller
                .connect(secondUserSigner)
                .registerProfile("Gian", "AR", 0)
        )
            .to.emit(decentraveller, "ProfileCreated")
            .withArgs(secondUser, "Gian", "AR", 0, 1);

        const { thirdUser } = await getNamedAccounts();
        const thirdUserSigner = await ethers.getSigner(thirdUser);

        await expect(
            decentraveller
                .connect(thirdUserSigner)
                .registerProfile("Mati", "AR", 0)
        )
            .to.emit(decentraveller, "ProfileCreated")
            .withArgs(thirdUser, "Mati", "AR", 0, 1);

        const { fourthUser } = await getNamedAccounts();
        const fourthUserSigner = await ethers.getSigner(fourthUser);

        await expect(
            decentraveller
                .connect(fourthUserSigner)
                .registerProfile("Gino", "AR", 0)
        )
            .to.emit(decentraveller, "ProfileCreated")
            .withArgs(fourthUser, "Gino", "AR", 0, 0);
    });
});
