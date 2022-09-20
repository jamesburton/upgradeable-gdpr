// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GdprConsentV2 is Initializable {
    error BasePermissionAbsent(uint256 emailHash);
    error PlatformPermissionAbsent(uint256 emailHash, string platform);
    error PlatformPurposePermissionAbsent(uint256 emailHash, string platform, string purpose);
    error PermissionAlreadyGranted();
    error PlatformDoesNotExist(string platform);
    error PurposeDoesNotExist(string purpose);
    error PlatformAlreadyExists(string platform);
    error PurposeAlreadyExists(string purpose);

    mapping(uint256 => bool) public basePermissions;
    mapping(uint256 => bool) public platformPermissions;
    mapping(uint256 => bool) public platformPurposePermissions;
    uint private platformCount;
    mapping(uint => string) platforms;
    uint private purposeCount;
    mapping(uint => string) purposes;

    modifier platformExists(string memory platform) {
        bool exists = false;
        for(uint i = 0; i < platformCount; i++) {
            if(keccak256(abi.encodePacked(platforms[i])) == keccak256(abi.encodePacked(platform))) {
                exists = true;
                break;
            }
        }
        if(!exists) revert PlatformDoesNotExist(platform);
        _;
    }

    modifier platformDoesNotExist(string memory platform) {
        for(uint i = 0; i < platformCount; i++) {
            if(keccak256(abi.encodePacked(platforms[i])) == keccak256(abi.encodePacked(platform))) {
                revert PlatformAlreadyExists(platform);
            }
        }
        _;
    }

    modifier purposeExists(string memory purpose) {
        bool exists = false;
        for(uint i = 0; i < purposeCount; i++) {
            if(keccak256(abi.encodePacked(purposes[i])) == keccak256(abi.encodePacked(purpose))) {
                exists = true;
                break;
            }
        }
        if(!exists) revert PurposeDoesNotExist(purpose);
        _;
    }

    modifier purposeDoesNotExist(string memory purpose) {
        for(uint i = 0; i < purposeCount; i++) {
            if(keccak256(abi.encodePacked(purposes[i])) == keccak256(abi.encodePacked(purpose))) {
                revert PurposeAlreadyExists(purpose);
            }
        }
        _;
    }

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

    function grantPlatformPermission(string calldata email, string calldata platform) public platformExists(platform) {
        uint256 _hash = emailAndPlatformHash(email, platform); 
        if(platformPermissions[_hash])
            revert PermissionAlreadyGranted();
        platformPermissions[_hash] = true;
    }

    function revokePlatformPermission(string calldata email, string calldata platform) public platformExists(platform) {
        uint256 _hash = emailAndPlatformHash(email, platform); 
        if(!platformPermissions[_hash])
            revert PlatformPermissionAbsent(_hash, platform);
        delete platformPermissions[_hash];
    }

    function getPlatformPermission(string calldata email, string calldata platform) public view platformExists(platform) returns (bool) {
        uint256 _hash = emailAndPlatformHash(email, platform);
        return platformPermissions[_hash];
    }

    function grantPlatformPurposePermission(string calldata email, string calldata platform, string calldata purpose) public platformExists(platform) purposeExists(purpose) {
        uint256 _hash = emailPlatformAndPurposeHash(email, platform, purpose); 
        if(platformPurposePermissions[_hash])
            revert PermissionAlreadyGranted();
        platformPurposePermissions[_hash] = true;
    }

    function revokePlatformPurposePermission(string calldata email, string calldata platform, string calldata purpose) public platformExists(platform) purposeExists(purpose) {
        uint256 _hash = emailPlatformAndPurposeHash(email, platform, purpose); 
        if(!platformPurposePermissions[_hash])
            revert PlatformPermissionAbsent(_hash, platform);
        delete platformPurposePermissions[_hash];
    }

    function getPlatformPurposePermission(string calldata email, string calldata platform, string calldata purpose) public view platformExists(platform) purposeExists(purpose) returns (bool) {
        uint256 _hash = emailPlatformAndPurposeHash(email, platform, purpose);
        return platformPurposePermissions[_hash];
    }

    function addPlatform(string calldata platform) public platformDoesNotExist(platform) {
        platforms[platformCount] = platform;
        platformCount++;
    }

    // function removePlatform(string calldata platform) public {
    //     // Omitted to avoid rebuilding the array
    // }

    function getPlatforms() public view returns (string[] memory) {
        string[] memory _platforms = new string[](platformCount);
        for(uint i = 0; i < platformCount; i++) {
            _platforms[i] = platforms[i];
        }
        return _platforms;
    }

    function addPurpose(string calldata purpose) public purposeDoesNotExist(purpose) {
        purposes[purposeCount] = purpose;
        purposeCount++;
    }

    // function removePurpose(string calldata platform) public {
    //     // Omitted to avoid rebuilding the array
    // }

    function getPurposes() public view returns (string[] memory) {
        string[] memory _purposes = new string[](purposeCount);
        for(uint i = 0; i < purposeCount; i++) {
            _purposes[i] = purposes[i];
        }
        return _purposes;
    }
}