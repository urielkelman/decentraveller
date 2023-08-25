import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, ethers } = hre;
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

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

    const governanceDeployment = await get("DecentravellerGovernance");

    const decentraveller = await deploy("Decentraveller", {
        from: deployer,
        args: [
            governanceDeployment.address,
            decentravellerPlaceFactory.address,
        ],
        log: true,
    });
};

deployFunction.tags = ["all"];

export default deployFunction;
