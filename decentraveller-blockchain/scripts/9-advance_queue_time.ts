import { time } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
    // Increase evm time and execute.
    await time.increase(1 * 24 * 60 * 60);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
