import * as IPFS from "ipfs-http-client";
import fs from "fs";

const main = async () => {
    const ipfsClient = IPFS.create({
        host: "ipfs-host",
        port: "5001",
        protocol: "http",
    });

    const data = fs.readFileSync("./di_maria.jpg");

    const fileAdded = await ipfsClient.add({
        path: "di-maria.jpg",
        content: data,
    });

    console.log("Added file:", fileAdded.path, fileAdded.cid.toString());
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
