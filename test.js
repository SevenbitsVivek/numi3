const axios = require('axios');
const InputDataDecoder = require('ethereum-input-data-decoder');
const fileHelper = require('./helper/fileHelper.js');
const ethers = require('ethers');
const fs = require('fs');

const test = async (req, res) => {
    try {
        const MY_API_KEY = "75TRTDT2BKZV83XSN3YZ6MVZ2PVZR75M1E"
        const CONTRACT_ADDRESS = "0x888542594b60f377928e7617CDF8C94c24eF829d"
        var START_BLOCK
        const END_BLOCK = "99999999"
        const abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "EtherTransfered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "_from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "_to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "TokenTransfered", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "custId", "type": "string" }, { "internalType": "uint256", "name": "roles", "type": "uint256" }, { "internalType": "bytes32", "name": "hash", "type": "bytes32" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "depositEtherFund", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "string", "name": "custId", "type": "string" }, { "internalType": "uint256", "name": "roles", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32", "name": "hash", "type": "bytes32" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "depositTokenFund", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }], "name": "getTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTransferedAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newTransferedAddress", "type": "address" }], "name": "setTransferedAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/04b835bf9aca4468b7d7ee914b4f58ff");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        let transactionResponse = await axios({
            url: `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${CONTRACT_ADDRESS}&startblock=${START_BLOCK}&endblock=${END_BLOCK}&sort=asc&apikey=${MY_API_KEY}`,
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
            method: "GET",
        })
        fs.readFile("deposit.json", async function (err, data) {
            if (err) throw err;
            const users = JSON.parse(data);
            START_BLOCK = users
            console.log("START_BLOCK ===>", START_BLOCK)
            for (var i = 0; i < transactionResponse.data.result.length; i++) {
                const data = transactionResponse.data.result[i].input;
                const decoder = new InputDataDecoder(abi);
                const result = decoder.decodeData(data);
                if (transactionResponse.data.result[i].blockNumber > START_BLOCK) {
                    if (transactionResponse.data.result[i].txreceipt_status == 1) {
                        if (result.method == "depositEtherFund") {
                            let eventFilter = contract.filters.EtherTransfered()
                            let events = await contract.queryFilter(eventFilter)
                            if (events) {
                                var etherFundResults = []
                                etherFundResults.push({ [result.names[0]]: result.inputs[0], [result.names[1]]: result.inputs[1], [result.names[2]]: result.inputs[2], [result.names[3]]: result.inputs[3], value: ethers.utils.formatEther(transactionResponse.data.result[i].value) })
                                console.log("etherFundResults ===>", etherFundResults);
                            }
                        } else if (result.method == "depositTokenFund") {
                            let eventFilter = contract.filters.TokenTransfered()
                            let events = await contract.queryFilter(eventFilter)
                            if (events) {
                                var tokenFundResults = []
                                tokenFundResults.push({ [result.names[0]]: result.inputs[0], [result.names[1]]: [result.inputs[1]], [result.names[2]]: result.inputs[2], [result.names[3]]: result.inputs[3], [result.names[4]]: result.inputs[4], [result.names[5]]: result.inputs[5] })
                                console.log("tokenFundResults ===>", tokenFundResults);
                            }
                        }
                    }
                    await fileHelper.setLatestBlock(transactionResponse.data.result[i].blockNumber);
                }
            }
        })
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}
test()

//BigNumber conversion
//ethers.BigNumber.from(result.inputs[1]).toNumber()