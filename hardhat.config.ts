import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

// const infuraNetworks = ['mainnet','ropsten','goerli','kovan','sepolia','rinkeby','near-mainnet','near-testnet','aurora-mainnet','aurora-testnet'];
const infuraNetworks
const networks = {};
const infuraKey = process.env.INFURA_KEY;
const privateKey = process.env.PRIVATE_KEY;
let accounts = [process.env.FANTOM_TEST_PRIVATE_KEY].filter(Boolean) as string[];
networks['fantom-test'] = {
    fantomtest: {
        url: "https://rpc.testnet.fantom.network",
        accounts,
        chainId: 4002,
        live: false,
        saveDeployments: true,
        gasMultiplier: 2,
    },
};
accounts = [process.env.FANTOM_PRIVATE_KEY].filter(Boolean) as string[];
netwokrs['fantom'] = {
    fantom: {
        url: "https://rpc.fantom.network",
        accounts,
        chainId: 250,
        live: true,
        saveDeployments: true,
        gasMultiplier: 1,
    }
};
if(infuraKey?.length) {
    for(const network of infuraNetworks) {
        networks[network] = {
            url: `https://${network}.infura.io/v3/${infuraKey}`,
            accounts: [privateKey].filter(Boolean) as string[],
        };
    }
}

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
