// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAgentRule {
    struct Rule {
        address agentId;
        bytes32 ruleHash;
        uint256 version;
        bool active;
    }

    event RuleCommitted(uint256 indexed ruleId, address indexed agentId, bytes32 ruleHash);
    event RuleRevoked(uint256 indexed ruleId);

    function commitRule(address _agentId, bytes32 _ruleHash) external returns (uint256);
    function revokeRule(uint256 _ruleId) external;
    function getRule(uint256 _ruleId) external view returns (Rule memory);
    function getActiveRule(address _agentId) external view returns (Rule memory);
}
