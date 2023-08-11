import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { tokenOwner } = await getNamedAccounts();

    await deploy("DecentravellerToken", {
        from: tokenOwner,
        log: true,
    });
};

deployFunction.tags = ["all", "token"];

export default deployFunction;
