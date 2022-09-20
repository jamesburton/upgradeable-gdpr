// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GdprConsentV1 is Initializable {
    error BasePermissionAbsent(uint256 emailHash);
    error PlatformPermissionAbsent(uint256 emailHash, string platform);
    error PlatformPurposePermissionAbsent(uint256 emailHash, string platform, string purpose);
    error PermissionAlreadyGranted();

    mapping(uint256 => bool) public basePermissions;
    mapping(uint256 => bool) public platformPermissions;
    mapping(uint256 => bool) public platformPurposePermissions;

    function initialize() public initializer {
    }

    function emailToHash(string calldata email) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked("Email:",email)));
    } 

    function emailAndPlatformHash(string calldata email, string calldata platform) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked("Consent:",email," on ",platform)));
    }

    function emailPlatformAndPurposeHash(string calldata email, string calldata platform, string calldata purpose) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked("Consent:",email," on ",platform," to ",purpose)));
    }

    function grantBasePermission(string calldata email) public {
        uint256 _emailHash = emailToHash(email); 
        if(basePermissions[_emailHash])
            revert PermissionAlreadyGranted();
        basePermissions[_emailHash] = true;
    }

    function revokeBasePermission(string calldata email) public {
        uint256 _emailHash = emailToHash(email); 
        if(!basePermissions[_emailHash])
            revert BasePermissionAbsent(_emailHash);
        delete basePermissions[_emailHash];
    }

    function getBasePermission(string calldata email) public view returns (bool) {
        uint256 _emailHash = emailToHash(email);
        return basePermissions[_emailHash];
    }

    function grantPlatformPermission(string calldata email, string calldata platform) public {
        uint256 _hash = emailAndPlatformHash(email, platform); 
        if(platformPermissions[_hash])
            revert PermissionAlreadyGranted();
        platformPermissions[_hash] = true;
    }

    function revokePlatformPermission(string calldata email, string calldata platform) public {
        uint256 _hash = emailAndPlatformHash(email, platform); 
        if(!platformPermissions[_hash])
            revert PlatformPermissionAbsent(_hash, platform);
        delete platformPermissions[_hash];
    }

    function getPlatformPermission(string calldata email, string calldata platform) public view returns (bool) {
        uint256 _hash = emailAndPlatformHash(email, platform);
        return platformPermissions[_hash];
    }

    function grantPlatformPurposePermission(string calldata email, string calldata platform, string calldata purpose) public {
        uint256 _hash = emailPlatformAndPurposeHash(email, platform, purpose); 
        if(platformPurposePermissions[_hash])
            revert PermissionAlreadyGranted();
        platformPurposePermissions[_hash] = true;
    }

    function revokePlatformPurposePermission(string calldata email, string calldata platform, string calldata purpose) public {
        uint256 _hash = emailPlatformAndPurposeHash(email, platform, purpose); 
        if(!platformPurposePermissions[_hash])
            revert PlatformPermissionAbsent(_hash, platform);
        delete platformPurposePermissions[_hash];
    }

    function getPlatformPurposePermission(string calldata email, string calldata platform, string calldata purpose) public view returns (bool) {
        uint256 _hash = emailPlatformAndPurposeHash(email, platform, purpose);
        return platformPurposePermissions[_hash];
    }
}