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
            console.log(result.method)
            if (result.method == "depositEtherFund") {
                var resultValue1 = result.inputs[0]
                var resultValue2 = ethers.BigNumber.from(result.inputs[1]).toNumber()
                var resultValue3 = result.inputs[2]
                var resultValue4 = result.inputs[3]
                var resultValue5 = ethers.utils.formatEther(transactionResponse.data.result[i].value)
                var etherFundResults = []
                etherFundResults.push({ custId: resultValue1, roles: resultValue2, hash: resultValue3, signature: resultValue4, value: resultValue5 })
                console.log("etherFundResults ===>", etherFundResults);
            } else if (result.method == "depositTokenFund") {
                var tokenFundResults = []
                var resultValue1 = result.inputs[0]
                var resultValue2 = result.inputs[1]
                var resultValue3 = ethers.BigNumber.from(result.inputs[2]).toNumber()
                var resultValue4 = ethers.BigNumber.from(result.inputs[3]).toNumber()
                var resultValue5 = result.inputs[4]
                var resultValue6 = result.inputs[5]
                tokenFundResults.push({ tokenAddress: resultValue1, custId: resultValue2, roles: resultValue3, amount: resultValue4, hash: resultValue5, signature: resultValue6 })
                console.log("tokenFundResults ===>", tokenFundResults);
            }
        }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

test()