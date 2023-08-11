const cryptography = require("crypto");

const main = async () => {
    const signedContent = 'id-1.1691009867.{"webhook-id":"id-1"}';
    const secret = "whsec_c2VjcmV0"; // Shared by Sardine

    // Need to base64 decode the secret
    const secretBytes = new Buffer(secret.split("_")[1], "base64");
    console.log(secretBytes);
    const signature = cryptography
        .createHmac("sha256", secretBytes)
        .update(signedContent)
        .digest("base64");
    console.log(signature);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
