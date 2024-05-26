// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CertificateManager {
    bytes32 private currentCID;

    function setCurrentCID(bytes32 cid) public {
        currentCID = cid;
    }

    function getCurrentCID() public view returns (bytes32) {
        return currentCID;
    }
}