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
    const GdprConsentV1 = await ethers.getContractFactory("GdprConsentV1");
    // const contract = await GdprConsentV1.deploy();
    const contract = await hre.upgrades.deployProxy(GdprConsentV1);
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
    it("Should not revert when setting platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantPlatformPermission(email1, platform1)).not.to.be.reverted;
    });
    it("Should not revert when setting platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.grantPlatformPurposePermission(email1, platform1, purpose1)).not.to.be.reverted;
    });
    it("Should revert when re-setting platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPermission(email1, platform1);
        await expect(contract.grantPlatformPermission(email1, platform1)).to.be.reverted;
    });
    it("Should revert when re-setting platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        await expect(contract.grantPlatformPurposePermission(email1, platform1, purpose1)).to.be.reverted;
    });
    it("Should not revert when setting 2nd platform permission with different platform", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPermission(email1, platform1);
        await expect(contract.grantPlatformPermission(email1, platform2)).not.to.be.reverted;
    });
    it("Should not revert when setting 2nd platform permission with different email", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPermission(email1, platform1);
        await expect(contract.grantPlatformPermission(email2, platform1)).not.to.be.reverted;
    });
    it("Should not revert when setting 2nd platform+purpose permission differing by email", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        await expect(contract.grantPlatformPurposePermission(email2, platform1, purpose1)).not.to.be.reverted;
    });
    it("Should not revert when setting 2nd platform+purpose permission differing by platform", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        await expect(contract.grantPlatformPurposePermission(email1, platform2, purpose1)).not.to.be.reverted;
    });
    it("Should not revert when setting 2nd platform+purpose permission differing by purpose", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        await expect(contract.grantPlatformPurposePermission(email1, platform1, purpose2)).not.to.be.reverted;
    });
    it("Should not revert when revoking existing platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPermission(email1, platform1);
        await expect(contract.revokePlatformPermission(email1, platform1)).not.to.be.reverted;
    });
    it("Should not revert when revoking existing platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        await expect(contract.revokePlatformPurposePermission(email1, platform1, purpose1)).not.to.be.reverted;
    });
    it("Should revert when revoking missing platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.revokePlatformPermission(email1, platform1)).to.be.reverted;
    });
    it("Should revert when revoking missing platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.revokePlatformPurposePermission(email1, platform1, purpose1)).to.be.reverted;
    });
    it("Should not revert getting base permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.getBasePermission(email1)).not.to.be.reverted;
    });
    it("Should not revert getting platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.getPlatformPermission(email1, platform1)).not.to.be.reverted;
    });
    it("Should not revert getting platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await expect(contract.getPlatformPurposePermission(email1, platform1, purpose1)).not.to.be.reverted;
    });
    it("Should return false for unset platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        const permission = await contract.getPlatformPermission(email1, platform1);
        expect(permission).to.equal(false);
    });
    it("Should return true for set platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPermission(email1, platform1);
        const permission = await contract.getPlatformPermission(email1, platform1);
        expect(permission).to.equal(true);
    });
    it("Should return false for revoked platform permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPermission(email1, platform1);
        await contract.revokePlatformPermission(email1, platform1);
        const permission = await contract.getPlatformPermission(email1, platform1);
        expect(permission).to.equal(false);
    });
    it("Should return false for unset platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        const permission = await contract.getPlatformPurposePermission(email1, platform1, purpose1);
        expect(permission).to.equal(false);
    });
    it("Should return true for set platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        const permission = await contract.getPlatformPurposePermission(email1, platform1, purpose1);
        expect(permission).to.equal(true);
    });
    it("Should return false for revoked platform+purpose permission", async function() {
        const { contract } = await loadFixture(deployProxyFixture);
        await contract.grantPlatformPurposePermission(email1, platform1, purpose1);
        await contract.revokePlatformPurposePermission(email1, platform1, purpose1);
        const permission = await contract.getPlatformPurposePermission(email1, platform1, purpose1);
        expect(permission).to.equal(false);
    });
});