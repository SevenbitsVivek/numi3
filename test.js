import axios from 'axios';
import InputDataDecoder from 'ethereum-input-data-decoder';
import ethers from 'ethers';

export const test = async (req, res) => {
    try {
        const MYAPIKEY = "75TRTDT2BKZV83XSN3YZ6MVZ2PVZR75M1E"
        const Address = "0x222BbD004F253720F1Db495eBe9779BC40cE0e5d"
        const startblock = "0"
        const endblock = "99999999"
        const abi = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "EtherTransfered",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "TokenTransfered",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "custId",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "roles",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "hash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "name": "depositEtherFund",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "custId",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "roles",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "hash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "name": "depositTokenFund",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    }
                ],
                "name": "getTokenBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
        let transactionResponse = await axios({
            url: `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${Address}&startblock=${startblock}&endblock=${endblock}&sort=asc&apikey=${MYAPIKEY}`,
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
            method: "GET",
        })
        for (var i = 0; i < transactionResponse.data.result.length; i++) {
            const data = transactionResponse.data.result[i].input;
            const decoder = new InputDataDecoder(abi);
            const result = decoder.decodeData(data);
            if (transactionResponse.data.result[i].txreceipt_status == 1) {
                if (result.method == "depositEtherFund") {
                    var etherFundResults = []
                    etherFundResults.push({ [result.names[0]]: result.inputs[0], [result.names[1]]: ethers.BigNumber.from(result.inputs[1]).toNumber(), [result.names[2]]: result.inputs[2], [result.names[3]]: result.inputs[3], value: ethers.utils.formatEther(transactionResponse.data.result[i].value) })
                    console.log("etherFundResults ===>", etherFundResults);
                } else if (result.method == "depositTokenFund") {
                    var tokenFundResults = []
                    tokenFundResults.push({ [result.names[0]]: result.inputs[0], [result.names[1]]: [result.inputs[1]], [result.names[1]]: ethers.BigNumber.from(result.inputs[2]).toNumber(), [result.names[3]]: ethers.BigNumber.from(result.inputs[3]).toNumber(), [result.names[4]]: result.inputs[4], [result.names[5]]: result.inputs[5] })
                    console.log("tokenFundResults ===>", tokenFundResults);
                }
            }
        }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

test()