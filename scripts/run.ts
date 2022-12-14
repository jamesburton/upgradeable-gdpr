const { ethers, upgrades } = require("hardhat");

const hre = (global as any).hre;

async function main() {
  const GdprConsentV1 = await ethers.getContractFactory("GdprConsentV1");
  const proxy = await upgrades.deployProxy(GdprConsentV1);
  await proxy.deployed();

  console.log('Contract (proxy) deployed to: ', proxy.address);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxy.address);
  console.log(`- Implementation deployed to: ${implementationAddress}`);

  const GdprConsentV2 = await ethers.getContractFactory("GdprConsentV2");
  const updatedProxy = await upgrades.upgradeProxy(proxy.address, GdprConsentV2);

  console.log('Contract (proxy) updated at: ', proxy.address);

  const v2ImplementationAddress = await upgrades.erc1967.getImplementationAddress(updatedProxy.address);
  console.log(`- V2 Implementation deployed to: ${v2ImplementationAddress}`);
}

async function runMain() {
    try {
        await main();
    } catch(error) {
        console.log(error);
    }
}

runMain();