const ethers = require('ethers');
const main = async () => {
    const allowlistedAddresses = [
        '0x69321A1231687C9D55BbA0e37560a7058210B379'
        // '0xccdb17b8eF68ffFdbCA4bf4AB6B765e41d61733A',
    ];
    const privateKey = '9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542';
    // const owner = 'Owner_Wallet_Address';
    // const privateKey = 'Owner_Private_Key';
    const signer = new ethers.Wallet(privateKey);
    console.log("Signer Wallet Address ===>", signer.address)

    // Get first allowlisted address
    let message = 'hello' + Date.now();
    // Compute hash of the address
    let messageHash = ethers.utils.id(message);
    console.log("Message Hash ===>", messageHash);
    // Sign the hashed address
    let messageBytes = ethers.utils.arrayify(messageHash);
    console.log("messageBytes ===>", messageBytes)
    let signature = await signer.signMessage(messageBytes);
    console.log("Signature ===> ", signature);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
runMain();