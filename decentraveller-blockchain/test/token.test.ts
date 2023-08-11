import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DecentravellerToken } from "../typechain-types";

describe("Decentraveller token ", function () {
    let decentravellerToken: DecentravellerToken;
    let tokenOwnerAddress: string;
    let userAddress: string;

    beforeEach(async function () {
        await deployments.fixture(["token"]);
        const { user, tokenOwner } = await getNamedAccounts();
        userAddress = user;
        tokenOwnerAddress = tokenOwner;
        decentravellerToken = await ethers.getContractAt(
            "DecentravellerToken",
            tokenOwner
        );
    });

    it("Should not be minted by an address that is not the owner", async function () {
        const tokenContract = await ethers.getContract(
            "DecentravellerToken",
            userAddress
        );
        await expect(tokenContract.mint(userAddress, 1000)).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });

    it("Should delegate the voting power when the mint function is invoked", async function () {
        // await
    });
});
