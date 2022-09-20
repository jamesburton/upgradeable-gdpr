// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GdprConsentV1 is Initializable {
    error BasePermissionAbsent(uint256 emailHash);
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

    function revokeBasePermission(string calldata email) public {
        uint256 _emailHash = emailToHash(email); 
        if(!basePermissions[_emailHash])
            revert BasePermissionAbsent(_emailHash);
        delete basePermissions[_emailHash];
    }

    function grantBasePermission(string calldata email) public {
        uint256 _emailHash = emailToHash(email); 
        if(basePermissions[_emailHash])
            revert PermissionAlreadyGranted();
        basePermissions[_emailHash] = true;
    }
}