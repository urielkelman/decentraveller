import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Decentraveller, DecentravellerToken } from "../typechain-types";

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
    const decentravellerReviewFactory = await deploy(
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
    const decentravellerPlaceFactory = await deploy(
        "DecentravellerPlaceCloneFactory",
        {
            from: deployer,
            args: [
                decentravellerPlace.address,
                decentravellerReviewFactory.address,
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
        decentravellerPlaceFactory.address,
        decentravellerReviewFactory.address,
    ]);

    await addFactoriesAsMintersTx.wait();

    const governanceDeployment = await get("DecentravellerGovernance");

    const decentravellerDeployment = await deploy("Decentraveller", {
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

    const decentraveller: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        decentravellerDeployment.address,
        deployer
    );

    const registerDeployerProfileTx = await decentraveller.registerProfile(
        "Deployer",
        "AR",
        0
    );

    await registerDeployerProfileTx.wait();
};
deployFunction.tags = ["all"];
export default deployFunction;
