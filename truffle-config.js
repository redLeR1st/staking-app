require('babel-register');
require('babel-polyfill');
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        var privateKeys  = process.env.PRIV_KEYS;
        return new HDWalletProvider(privateKeys, 'https://ropsten.infura.io/v3/' + process.env.INFURA_API_KEY);
      },
      network_id: 3,
      gas: 4000000,
      gasPrice: 100000000000
      // ,confirmations: 2 // use this in case of mainnet
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
