const { ethers, upgrades } = require("hardhat");

if(!process.env.HARDHAT_NETWORK) {
    // We are trying to run against hardhat temporary instance, so cannot deploy where the base will never exist
    throw new Error('deploy-V2 does not work on the test instance, please specify a network or use run.ts instead');
}

const proxyAddresses:{ [key:string]: string } = {
    localhost: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};
const proxyAddress = proxyAddresses[process.env.HARDHAT_NETWORK as string];
if(!proxyAddress?.length)
    throw new Error(`No proxy address avaiable for network=${process.env.HARDHAT_NETWORK}`);

const hre = (global as any).hre;

async function main() {
  if(!proxyAddress.length) throw new Error("Cannot deploy V2 without the base proxy address");

  const GdprConsentV2 = await ethers.getContractFactory("GdprConsentV2");
  const proxy = await upgrades.upgradeProxy(proxyAddress, GdprConsentV2);
  await proxy.deployed();

  console.log('Contract (proxy) deployed to: ', proxy.address);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
  console.log(`- Implementation deployed to: ${implementationAddress}`);
}

async function runMain() {
    try {
        await main();
    } catch(error) {
        console.log(error);
    }
}

runMain();