import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { tokenOwner, tokenMinter } = await getNamedAccounts();

    await deploy("DecentravellerToken", {
        from: tokenOwner,
        log: true,
        args: [1, 2, tokenOwner, [tokenMinter]],
    });
};

deployFunction.tags = ["all", "token"];

export default deployFunction;
