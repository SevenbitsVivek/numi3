require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');

module.exports = {
  solidity: "0.8.7",
  // Testnets
  networks: {
    //BSC Testnet
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: ['9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542']
    },
    //Goerli Testnet
    goerli: {
      url: `https://goerli.infura.io/v3/681d784bc2db408b8aa49ec6b887d47a`,
      gas: 300000000,
      accounts: ['9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542'],
    },
    //Polygon Testnet
    matic: {
      url: "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
      accounts: ['9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542']
    }
  },

  etherscan: {
    // polygon apiKey
    // apiKey: "61NXGEUMZJGEXU5ZTZQN8ZGHRBC8PAVSFN"
    apiKey: {
      // bsc: "7FH7WAR3SHRS7UDI2YZQWVR5F1SJ3PJBI2",
      goerli: "JB7KZVSGD7Z4AGJGEYITX4WY1W5V4I5D1K",
      // mainnet: "JB7KZVSGD7Z4AGJGEYITX4WY1W5V4I5D1K"
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      details: { yul: false },
    },
  },
};
