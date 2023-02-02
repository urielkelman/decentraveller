import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const decentravellerPlace = await deploy("DecentravellerPlace", {
        from: deployer,
        log: true,
    });

    const decentravellerPlaceFactory = await deploy(
        "DecentravellerPlaceCloneFactory",
        {
            from: deployer,
            args: [decentravellerPlace.address],
            log: true,
        }
    );

    const decentraveller = await deploy("Decentraveller", {
        from: deployer,
        args: [decentravellerPlaceFactory.address],
        log: true,
    });

    console.log(decentraveller);
};

deployFunction.tags = ["all"];

export default deployFunction;
