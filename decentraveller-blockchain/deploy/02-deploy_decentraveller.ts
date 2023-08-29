import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { DecentravellerToken } from "../typechain-types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, ethers } = hre;
    const { deploy, get } = deployments;
    const { deployer, tokenOwner } = await getNamedAccounts();

    const decentravellerReview = await deploy("DecentravellerReview", {
        from: deployer,
        log: true,
    });

    const decentravellerReviewFactory = await deploy(
        "DecentravellerReviewCloneFactory",
        {
            from: deployer,
            args: [decentravellerReview.address],
            log: true,
        }
    );

    const decentravellerPlace = await deploy("DecentravellerPlace", {
        from: deployer,
        log: true,
    });

    const decentravellerPlaceFactory = await deploy(
        "DecentravellerPlaceCloneFactory",
        {
            from: deployer,
            args: [
                decentravellerPlace.address,
                decentravellerReviewFactory.address,
            ],
            log: true,
        }
    );

    const tokenDeployment = await get("DecentravellerGovernance");

    const token: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        tokenDeployment.address,
        tokenOwner
    );

    const addFactoriesAsMintersTx = await token.addMinters([
        decentravellerPlaceFactory.address,
        decentravellerReviewFactory.address,
    ]);

    await addFactoriesAsMintersTx.wait();

    const governanceDeployment = await get("DecentravellerGovernance");

    await deploy("Decentraveller", {
        from: deployer,
        args: [
            governanceDeployment.address,
            decentravellerPlaceFactory.address,
            [
                "Do not insult any person.",
                "If it is a gastronomic place, you should specify what you ate.",
            ],
        ],
        log: true,
    });
};

deployFunction.tags = ["all"];

export default deployFunction;
