// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAgentIdentity {
    struct Agent {
        address wallet;
        string name;
        string metadataURI;
        uint256 createdAt;
        bool isActive;
        address owner;
        bytes32 agentKeyHash;
    }

    function registerAgent(
        string calldata _name,
        string calldata _metadataURI,
        bytes32 _agentKeyHash
    ) external returns (uint256);

    function verifyAgentSignature(
        uint256 _agentId,
        bytes32 _messageHash,
        bytes calldata _signature
    ) external view returns (bool);

    function isAgentActive(uint256 _agentId) external view returns (bool);
    function getAgentByWallet(address _wallet) external view returns (uint256);
}
