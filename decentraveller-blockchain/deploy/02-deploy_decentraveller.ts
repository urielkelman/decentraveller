import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
    DecentravellerPlaceCloneFactory,
    DecentravellerReviewCloneFactory,
    DecentravellerToken,
} from "../typechain-types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, ethers } = hre;
    const { deploy, get } = deployments;
    const { deployer, tokenOwner } = await getNamedAccounts();

    const tokenDeployment = await get("DecentravellerToken");

    const decentravellerReview = await deploy("DecentravellerReview", {
        from: deployer,
        log: true,
    });
    const decentravellerReviewFactoryDeployment = await deploy(
        "DecentravellerReviewCloneFactory",
        {
            from: deployer,
            args: [decentravellerReview.address, tokenDeployment.address],
            log: true,
        }
    );
    const decentravellerPlace = await deploy("DecentravellerPlace", {
        from: deployer,
        log: true,
    });
    const decentravellerPlaceFactoryDeployment = await deploy(
        "DecentravellerPlaceCloneFactory",
        {
            from: deployer,
            args: [
                decentravellerPlace.address,
                decentravellerReviewFactoryDeployment.address,
                tokenDeployment.address,
            ],
            log: true,
        }
    );

    const token: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        tokenDeployment.address,
        tokenOwner
    );

    const addFactoriesAsMintersTx = await token.addMinters([
        decentravellerPlaceFactoryDeployment.address,
        decentravellerReviewFactoryDeployment.address,
    ]);

    await addFactoriesAsMintersTx.wait();

    const governanceDeployment = await get("DecentravellerGovernance");

    const decentravellerDeployment = await deploy("Decentraveller", {
        from: deployer,
        args: [
            governanceDeployment.address,
            decentravellerPlaceFactoryDeployment.address,
            tokenDeployment.address,
            [
                "Do not insult any person.",
                "If it is a gastronomic place, you should specify what you ate.",
            ],
            3,
            500,
        ],
        log: true,
    });

    const decentravellerPlaceFactory: DecentravellerPlaceCloneFactory =
        await ethers.getContractAt(
            "DecentravellerPlaceCloneFactory",
            decentravellerPlaceFactoryDeployment.address,
            deployer
        );

    const transferOwnershipTx =
        await decentravellerPlaceFactory.transferOwnership(
            decentravellerDeployment.address
        );

    await transferOwnershipTx.wait();

    const decentravellerReviewFactory: DecentravellerReviewCloneFactory =
        await ethers.getContractAt(
            "DecentravellerReviewCloneFactory",
            decentravellerReviewFactoryDeployment.address,
            deployer
        );

    const placeRegistrationRole =
        await decentravellerReviewFactory.PLACE_REG_ROLE();

    const addPlaceRegistrationRoleTx =
        await decentravellerReviewFactory.grantRole(
            placeRegistrationRole,
            decentravellerPlaceFactoryDeployment.address
        );

    await addPlaceRegistrationRoleTx.wait();

    const transferReviewFactoryOwnershipTx =
        await decentravellerReviewFactory.transferOwnership(
            decentravellerDeployment.address
        );

    await transferReviewFactoryOwnershipTx.wait();
};
deployFunction.tags = ["all"];
export default deployFunction;
