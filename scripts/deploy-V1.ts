const { ethers, upgrades } = require("hardhat");

const hre = (global as any).hre;

async function main() {
  const GdprConsentV1 = await ethers.getContractFactory("GdprConsentV1");
  const proxy = await upgrades.deployProxy(GdprConsentV1);
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