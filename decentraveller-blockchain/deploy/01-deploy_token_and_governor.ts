import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { DecentravellerToken, TimelockController } from "../typechain-types";

const deployFunction: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, ethers } = hre;
    const { deploy } = deployments;
    const { tokenOwner, tokenMinter, deployer } = await getNamedAccounts();

    const tokenDeployment: DeployResult = await deploy("DecentravellerToken", {
        from: tokenOwner,
        log: true,
        args: [2, 5],
    });

    const token: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        tokenDeployment.address,
        tokenOwner
    );

    const addMintersTxResponse = await token.addMinters([tokenMinter]);

    addMintersTxResponse.wait();

    const timeLockDeployment: DeployResult = await deploy(
        "TimelockController",
        {
            from: deployer,
            log: true,
            args: [
                1 * 24 * 60 * 60, // 1 day in seconds
                [deployer], // proposers
                [deployer], // executors
                deployer, // admin - zero, non admin,
            ],
        }
    );

    const governanceDeployment: DeployResult = await deploy(
        "DecentravellerGovernance",
        {
            from: deployer,
            log: true,
            args: [tokenDeployment.address, timeLockDeployment.address],
        }
    );

    const timeLockController: TimelockController = await ethers.getContractAt(
        "TimelockController",
        timeLockDeployment.address,
        deployer
    );

    const proposerRole = await timeLockController.PROPOSER_ROLE();
    const executoreRole = await timeLockController.EXECUTOR_ROLE();
    const adminRole = await timeLockController.TIMELOCK_ADMIN_ROLE();

    await timeLockController.grantRole(
        proposerRole,
        governanceDeployment.address
    );
    await timeLockController.grantRole(
        executoreRole,
        governanceDeployment.address
    );
    await timeLockController.renounceRole(proposerRole, deployer);
    await timeLockController.renounceRole(executoreRole, deployer);
    await timeLockController.renounceRole(adminRole, deployer);
};

deployFunction.tags = ["all", "token", "governance"];

export default deployFunction;
