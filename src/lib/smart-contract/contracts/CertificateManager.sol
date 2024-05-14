// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CertificateManager {
    string private currentCID;

    function setCurrentCID(string memory cid) public {
        currentCID = cid;
    }

    function getCurrentCID() public view returns (string memory) {
        return currentCID;
    }
}