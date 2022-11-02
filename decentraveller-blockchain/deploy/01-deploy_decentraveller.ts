import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const decentraveller = deploy("Decentraveller", {
        from: deployer,
        log: true,
    });

    log("D<c")
};
