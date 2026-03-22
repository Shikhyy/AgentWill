// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IAgentWill } from "./interfaces/IAgentWill.sol";
import { IAgentRule } from "./interfaces/IAgentRule.sol";

contract AgentWill is Initializable, ERC165, ReentrancyGuard {

    using ECDSA for bytes32;

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

    uint256 public ruleSetCount;
    mapping(uint256 => RuleSet) public ruleSets;
    mapping(address => uint256[]) public ownerToRuleSets;
    mapping(address => uint256[]) public agentToRuleSets;
    mapping(bytes32 => bool) public usedSignatures;

    event RuleSetCreated(uint256 indexed ruleSetId, address indexed owner, address indexed agentId, bytes32 ruleHash);
    event RuleSetUpdated(uint256 indexed ruleSetId, bytes32 ruleHash);
    event RuleSetActivated(uint256 indexed ruleSetId, bool active);
    event ActionVerified(uint256 indexed ruleSetId, address indexed agent, address token, uint256 amount, bool allowed);
    event InteractionVerified(uint256 indexed ruleSetId, address indexed agent, address target, bool allowed);
    event DailyLimitReset(uint256 indexed ruleSetId, address token, uint256 newLimit);

    modifier onlyRuleSetOwner(uint256 _ruleSetId) {
        require(ruleSets[_ruleSetId].owner == msg.sender, "Only rule set owner");
        _;
    }

    function initialize() public initializer {
        ruleSetCount = 0;
    }

    function createRuleSet(
        address _agentId,
        bytes32 _ruleHash,
        SpendingRule[] calldata _spendingRules,
        InteractionRule[] calldata _interactionRules,
        bool _revealMetadata
    ) external returns (uint256) {
        require(_agentId != address(0), "Invalid agent ID");
        require(_ruleHash != bytes32(0), "Invalid rule hash");

        uint256 ruleSetId = ruleSetCount++;
        RuleSet storage rs = ruleSets[ruleSetId];

        rs.owner = msg.sender;
        rs.agentId = _agentId;
        rs.ruleSetId = ruleSetId;
        rs.ruleHash = _ruleHash;
        rs.isActive = true;
        rs.createdAt = block.timestamp;
        rs.updatedAt = block.timestamp;
        rs.revealMetadata = _revealMetadata;

        for (uint i = 0; i < _spendingRules.length; i++) {
            rs.spendingRules.push(_spendingRules[i]);
        }

        for (uint i = 0; i < _interactionRules.length; i++) {
            rs.interactionRules.push(_interactionRules[i]);
        }

        ownerToRuleSets[msg.sender].push(ruleSetId);
        agentToRuleSets[_agentId].push(ruleSetId);

        emit RuleSetCreated(ruleSetId, msg.sender, _agentId, _ruleHash);

        return ruleSetId;
    }

    function updateRuleSet(
        uint256 _ruleSetId,
        bytes32 _ruleHash,
        SpendingRule[] calldata _spendingRules,
        InteractionRule[] calldata _interactionRules,
        bool _revealMetadata
    ) external onlyRuleSetOwner(_ruleSetId) {
        RuleSet storage rs = ruleSets[_ruleSetId];
        rs.ruleHash = _ruleHash;
        rs.updatedAt = block.timestamp;
        rs.revealMetadata = _revealMetadata;

        delete rs.spendingRules;
        for (uint i = 0; i < _spendingRules.length; i++) {
            rs.spendingRules.push(_spendingRules[i]);
        }

        delete rs.interactionRules;
        for (uint i = 0; i < _interactionRules.length; i++) {
            rs.interactionRules.push(_interactionRules[i]);
        }

        emit RuleSetUpdated(_ruleSetId, _ruleHash);
    }

    function verifySpending(
        uint256 _ruleSetId,
        address _agent,
        address _token,
        uint256 _amount
    ) external nonReentrant returns (bool allowed, string memory reason) {
        RuleSet storage rs = ruleSets[_ruleSetId];

        if (!rs.isActive) return (false, "Rule set inactive");
        if (rs.agentId != _agent) return (false, "Agent not authorized for this rule set");

        for (uint i = 0; i < rs.spendingRules.length; i++) {
            SpendingRule memory rule = rs.spendingRules[i];
            if (rule.token == _token) {
                if (_amount > rule.perTxLimit) {
                    emit ActionVerified(_ruleSetId, _agent, _token, _amount, false);
                    return (false, "Exceeds per-transaction limit");
                }

                if (block.timestamp > rule.lastResetTime + 24 hours) {
                    rs.spendingRules[i].currentDailySpend = 0;
                    rs.spendingRules[i].lastResetTime = block.timestamp;
                    emit DailyLimitReset(_ruleSetId, _token, rule.dailyLimit);
                }

                if (rule.currentDailySpend + _amount > rule.dailyLimit) {
                    emit ActionVerified(_ruleSetId, _agent, _token, _amount, false);
                    return (false, "Exceeds daily limit");
                }

                rs.spendingRules[i].currentDailySpend += _amount;
                emit ActionVerified(_ruleSetId, _agent, _token, _amount, true);
                return (true, "");
            }
        }

        emit ActionVerified(_ruleSetId, _agent, _token, _amount, false);
        return (false, "Token not in spending rules");
    }

    function verifyInteraction(
        uint256 _ruleSetId,
        address _agent,
        address _target,
        bytes4 _selector
    ) external returns (bool allowed, string memory reason) {
        RuleSet storage rs = ruleSets[_ruleSetId];

        if (!rs.isActive) return (false, "Rule set inactive");
        if (rs.agentId != _agent) return (false, "Agent not authorized for this rule set");

        for (uint i = 0; i < rs.interactionRules.length; i++) {
            InteractionRule memory rule = rs.interactionRules[i];
            if (rule.target == _target) {
                if (!rule.allowed) {
                    emit InteractionVerified(_ruleSetId, _agent, _target, false);
                    return (false, "Target explicitly blocked");
                }
                if (rule.selectors.length == 0) {
                    emit InteractionVerified(_ruleSetId, _agent, _target, true);
                    return (true, "");
                }
                for (uint j = 0; j < rule.selectors.length; j++) {
                    if (rule.selectors[j] == _selector) {
                        emit InteractionVerified(_ruleSetId, _agent, _target, true);
                        return (true, "");
                    }
                }
                emit InteractionVerified(_ruleSetId, _agent, _target, false);
                return (false, "Selector not allowed");
            }
        }

        emit InteractionVerified(_ruleSetId, _agent, _target, false);
        return (false, "Target not in interaction rules");
    }

    function setRuleSetActive(uint256 _ruleSetId, bool _active) external onlyRuleSetOwner(_ruleSetId) {
        ruleSets[_ruleSetId].isActive = _active;
        ruleSets[_ruleSetId].updatedAt = block.timestamp;
        emit RuleSetActivated(_ruleSetId, _active);
    }

    function getRuleSet(uint256 _ruleSetId) external view returns (RuleSet memory) {
        return ruleSets[_ruleSetId];
    }

    function getRuleSetsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerToRuleSets[_owner];
    }

    function getRuleSetsByAgent(address _agent) external view returns (uint256[] memory) {
        return agentToRuleSets[_agent];
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IAgentWill).interfaceId || super.supportsInterface(interfaceId);
    }
}
