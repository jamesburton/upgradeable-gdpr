// const hre = require("hardhat");
const assert = require("assert");
const { expect } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const email1 = 'user1@example.com';
const email2 = 'user2@example.com';
const platform1 = "example.com";
const platform2 = "elsewhere.com";
const purpose1 = "Marketing";
const purpose2 = "Development";

describe("Hardhat Runtime Environment", function () {
  it("should have a config field", function () {
    assert.notEqual(hre.config, undefined);
  });
});

const deployProxyFixture = async function() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // const GdprConsentV2 = await ethers.getContractFactory("GdprConsentV2");
    // const contract = await GdprConsentV2.deploy();
    const GdprConsentV1 = await ethers.getContractFactory("GdprConsentV1");
    let contract = await hre.upgrades.deployProxy(GdprConsentV1);
    const GdprConsentV2 = await ethers.getContractFactory("GdprConsentV2");
    contract = await hre.upgrades.upgradeProxy(contract.address, GdprConsentV2);
    return { contract, owner, otherAccount };
};

describe("GdprConsentV2", async function() {
    // Platform Tests
    describe("Platform Handling", async function() {
        it("Should allow adding a platform without reverting", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await expect(contract.addPlatform(platform1)).not.to.be.reverted;
        });
        it("Should revert when adding an existing platform", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPlatform(platform1);
            await expect(contract.addPlatform(platform1)).to.be.reverted;
        });
        it("Should not revert when getting platforms", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await expect(contract.getPlatforms()).not.to.be.reverted;
        });
        it("Should list no platforms when none have been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            const platforms = await contract.getPlatforms();
            expect(platforms.length).to.equal(0);
        });
        it("Should list 1 platform once one has been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPlatform(platform1);
            const platforms = await contract.getPlatforms();
            expect(platforms.length).to.equal(1);
        });
        it("Should not revert when adding a different platform", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPlatform(platform1);
            await expect(contract.addPlatform(platform2)).not.to.be.reverted;
        });
        it("Should list 2 platforms once two have been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPlatform(platform1);
            await contract.addPlatform(platform2);
            const platforms = await contract.getPlatforms();
            expect(platforms.length).to.equal(2);
        });
        it("Should list the provided platforms when 2 have been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await expect(contract.addPlatform(platform1)).not.to.be.reverted;
            await expect(contract.addPlatform(platform2)).not.to.be.reverted;
            const platforms = await contract.getPlatforms();
            expect(platforms).to.eql([platform1, platform2]); // NB: Use .eql not .equal to compare values within array/list
        });
    });

    // Purpose Tests
    describe("Purpose Handling", async function() {
        it("Should allow adding a purpose without reverting", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await expect(contract.addPurpose(purpose1)).not.to.be.reverted;
        });
        it("Should revert when adding an existing purpose", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPurpose(purpose1);
            await expect(contract.addPurpose(purpose1)).to.be.reverted;
        });
        it("Should not revert when getting purposes", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await expect(contract.getPurposes()).not.to.be.reverted;
        });
        it("Should list no purposes when none have been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            const purposes = await contract.getPurposes();
            expect(purposes.length).to.equal(0);
        });
        it("Should list 1 purpose once one has been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPurpose(purpose1);
            const purposes = await contract.getPurposes();
            expect(purposes.length).to.equal(1);
        });
        it("Should not revert when adding a different purpose", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPurpose(purpose1);
            await expect(contract.addPurpose(purpose2)).not.to.be.reverted;
        });
        it("Should list 2 purposes once two have been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await contract.addPurpose(purpose1);
            await contract.addPurpose(purpose2);
            const purposes = await contract.getPurposes();
            expect(purposes.length).to.equal(2);
        });
        it("Should list the provided purposes when 2 have been added", async function() {
            const { contract } = await loadFixture(deployProxyFixture);
            await expect(contract.addPurpose(purpose1)).not.to.be.reverted;
            await expect(contract.addPurpose(purpose2)).not.to.be.reverted;
            const purposes = await contract.getPurposes();
            expect(purposes).to.eql([purpose1, purpose2]); // NB: Use .eql not .equal to compare values within array/list
        });
    });
});