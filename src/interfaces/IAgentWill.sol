// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAgentWill {
    struct SpendingRule {
        address token;
        uint256 dailyLimit;
        uint256 perTxLimit;
        uint256 currentDailySpend;
        uint256 lastResetTime;
    }

    struct InteractionRule {
        address target;
        bool allowed;
        bytes4[] selectors;
    }

    struct RuleSet {
        address owner;
        address agentId;
        uint256 ruleSetId;
        bytes32 ruleHash;
        bool isActive;
        uint256 createdAt;
        uint256 updatedAt;
        SpendingRule[] spendingRules;
        InteractionRule[] interactionRules;
        bool revealMetadata;
    }

    event RuleSetCreated(uint256 indexed ruleSetId, address indexed owner, address indexed agentId, bytes32 ruleHash);
    event RuleSetUpdated(uint256 indexed ruleSetId, bytes32 ruleHash);
    event ActionVerified(uint256 indexed ruleSetId, address indexed agent, address token, uint256 amount, bool allowed);
    event InteractionVerified(uint256 indexed ruleSetId, address indexed agent, address target, bool allowed);

    function createRuleSet(
        address _agentId,
        bytes32 _ruleHash,
        SpendingRule[] calldata _spendingRules,
        InteractionRule[] calldata _interactionRules,
        bool _revealMetadata
    ) external returns (uint256);

    function verifySpending(
        uint256 _ruleSetId,
        address _agent,
        address _token,
        uint256 _amount
    ) external returns (bool allowed, string memory reason);

    function verifyInteraction(
        uint256 _ruleSetId,
        address _agent,
        address _target,
        bytes4 _selector
    ) external returns (bool allowed, string memory reason);

    function getRuleSet(uint256 _ruleSetId) external view returns (RuleSet memory);
    function getRuleSetsByAgent(address _agent) external view returns (uint256[] memory);
}
