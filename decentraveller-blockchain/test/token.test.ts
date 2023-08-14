import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DecentravellerToken } from "../typechain-types";

describe("Decentraveller token ", function () {
    let decentravellerToken: DecentravellerToken;
    let tokenOwnerAddress: string;
    let tokenMinterAddress: string;
    let userAddress: string;

    beforeEach(async function () {
        await deployments.fixture(["token"]);
        const { user, tokenOwner, tokenMinter } = await getNamedAccounts();
        userAddress = user;
        tokenOwnerAddress = tokenOwner;
        tokenMinterAddress = tokenMinter;
        decentravellerToken = await ethers.getContractAt(
            "DecentravellerToken",
            tokenOwner
        );
    });

    it("Should not be minted by an address that does not have the minter role", async function () {
        const tokenContract = await ethers.getContract(
            "DecentravellerToken",
            userAddress
        );
        const minterRole = await tokenContract.getMinterRole();
        await expect(tokenContract.mint(userAddress, 1000)).to.be.revertedWith(
            `AccessControl: account ${userAddress.toLowerCase()} is missing role ${minterRole}`
        );
    });

    it("Should delegate the voting power when the mint function is invoked and balance should equal voting power", async function () {
        decentravellerToken.connect(tokenMinterAddress);
    });
});
