// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAgentRegistry {
    function registerAgent(address _agent, string calldata _name) external returns (uint256);
    function isRegisteredAgent(address _agent) external view returns (bool);
    function getAgentInfo(address _agent) external view returns (string memory name, uint256 registeredAt);
}
