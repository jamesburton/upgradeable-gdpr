import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";

dotenv.config();

type network = {
    url: string;
    accounts?: string[];
    chainId?: number;
    live?: boolean;
    saveDeployments?: boolean;
    gasMultiplier?: number;
};
type networksType = {
    [key:string]: network;

};

// const infuraNetworks = ['mainnet','ropsten','goerli','kovan','sepolia','rinkeby','near-mainnet','near-testnet','aurora-mainnet','aurora-testnet'];
const infuraNetworks:string[] = [/*'mainnet',*/'goerli','rinkeby'];
const networks:networksType = {};
const infuraKey = process.env.INFURA_KEY;
const privateKey = process.env.PRIVATE_KEY;
let accounts = [process.env.FANTOM_TEST_PRIVATE_KEY].filter(Boolean) as string[];
networks['fantom-test'] = {
    url: "https://rpc.testnet.fantom.network",
    accounts,
    chainId: 4002,
    live: false,
    saveDeployments: true,
    gasMultiplier: 2,
};
accounts = [process.env.FANTOM_PRIVATE_KEY].filter(Boolean) as string[];
networks['fantom'] = {
    url: "https://rpc.fantom.network",
    accounts,
    chainId: 250,
    live: true,
    saveDeployments: true,
    gasMultiplier: 1,
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
  networks,
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};

export default config;
