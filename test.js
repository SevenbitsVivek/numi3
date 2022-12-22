import axios from 'axios';
import InputDataDecoder from 'ethereum-input-data-decoder';
async function test(){
    const MYAPIKEY = "75TRTDT2BKZV83XSN3YZ6MVZ2PVZR75M1E"
    const Address = "0xd66330E638136FbF690e2C2D66A7FDc04F050197"
    const startblock = "8179225"
    const endblock = "8179231"

    const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"EtherTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_token","type":"address"},{"indexed":false,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"TokenTransfered","type":"event"},{"inputs":[{"internalType":"uint256","name":"custId","type":"uint256"},{"internalType":"uint256","name":"roles","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"depositEtherFund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"custId","type":"uint256"},{"internalType":"uint256","name":"roles","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"depositTokenFund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"getTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    let transactionResponse = await axios({
        url: `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${Address}&startblock=${startblock}&endblock=${endblock}&sort=asc&apikey=${MYAPIKEY}`,
        headers: { "Accept-Encoding": "gzip,deflate,compress" } ,
        method: "GET",
    })
    const decoder = new InputDataDecoder(abi);
    const data = transactionResponse.data.result[0].input;
    const result = decoder.decodeData(data);
    console.log("result ===>", result);
    console.log("transactionResponse.data.result[0].input ===>", transactionResponse.data.result[0].input)
}

test()




