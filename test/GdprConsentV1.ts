// const hre = require("hardhat");
const assert = require("assert");
const { expect } = require("chai");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const email1 = 'user1@example.com';
const email2 = 'user2@example.com';

describe("Hardhat Runtime Environment", function () {
  it("should have a config field", function () {
    assert.notEqual(hre.config, undefined);
  });
});

const deployProxyFixture = async function() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const GdprConsentV1 = await ethers.getContractFactory("GdprConsentV1");
    //const contract = await GdprConsentV1.deployProxy();
    const contract = await GdprConsentV1.deploy();
    return { contract, owner, otherAccount };
};

describe("GdprConsentV1", function() {
    // Fixture (Old-way ... replaced with loadFixture)
    // let contract:any;
    // this.beforeEach(async function() {
    //     const GdprConsentV1 = await ethers.getContractFactory("GdprConsentV1");
    //     // contract = await GdprConsentV1.deployProxy();
    //     contract = await GdprConsentV1.deploy();
    // });

    // Tests
    it("Should allow setting base permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantBasePermission(email1)).not.to.be.reverted;
    });
    it("Should revert re-setting base permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantBasePermission(email1);
        await expect(contract.grantBasePermission(email1)).to.be.reverted;
    });
    it("Should allow setting 2 email's base permissions", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantBasePermission(email1)).not.to.be.reverted;
        await expect(contract.grantBasePermission(email2)).not.to.be.reverted;
    });
    it("Should allow revoking existing email's base permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantBasePermission(email1)).not.to.be.reverted;
        await expect(contract.revokeBasePermission(email1)).not.to.be.reverted;
    });
    it("Should revert mising email's base permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.revokeBasePermission(email2)).to.be.reverted;
    });
    it("Should return false for 1st email's base permission check once without setting it", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.getBasePermission(email1)).not.to.be.reverted;
        const permission = await contract.getBasePermission(email1); // NB: Loses result, so unwrap from expect(...).not.to.be.reverted
        expect(permission).to.equal(false);
    });
    it("Should return true for 1st email's base permission check once set", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantBasePermission(email1)).not.to.be.reverted;
        await expect(contract.getBasePermission(email1)).not.to.be.reverted;
        const permission = await contract.getBasePermission(email1); // NB: Loses result, so unwrap from expect(...).not.to.be.reverted
        expect(permission).to.equal(true);
    });
    it("Should return false for 1st email's base permission check once revoked", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantBasePermission(email1)).not.to.be.reverted;
        await expect(contract.revokeBasePermission(email1)).not.to.be.reverted;
        await expect(contract.getBasePermission(email1)).not.to.be.reverted;
        const permission = await contract.getBasePermission(email1); // NB: Loses result, so unwrap from expect(...).not.to.be.reverted
        expect(permission).to.equal(false);
    });
});