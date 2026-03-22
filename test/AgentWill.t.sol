// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test, console2 } from "forge-std/Test.sol";
import { AgentWill } from "../src/AgentWill.sol";
import { AgentIdentity } from "../src/AgentIdentity.sol";

contract AgentWillTest is Test {
    AgentWill public agentWill;
    AgentIdentity public agentIdentity;

    address public owner = address(0x1);
    address public agent = address(0x2);

    function setUp() public {
        agentIdentity = new AgentIdentity();
        agentIdentity.initialize(address(0));

        agentWill = new AgentWill();
        agentWill.initialize();

        vm.deal(owner, 100 ether);
        vm.deal(agent, 100 ether);
    }

    function testCreateRuleSet() public {
        AgentWill.SpendingRule[] memory spendingRules = new AgentWill.SpendingRule[](1);
        spendingRules[0] = AgentWill.SpendingRule({
            token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,
            dailyLimit: 1000e6,
            perTxLimit: 100e6,
            currentDailySpend: 0,
            lastResetTime: 0
        });

        AgentWill.InteractionRule[] memory interactionRules = new AgentWill.InteractionRule[](0);

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test rules")),
            spendingRules,
            interactionRules,
            true
        );

        assertEq(ruleSetId, 0);

        AgentWill.RuleSet memory rs = agentWill.getRuleSet(ruleSetId);
        assertEq(rs.owner, owner);
        assertEq(rs.agentId, agent);
        assertTrue(rs.isActive);
    }

    function testVerifySpendingWithinLimits() public {
        AgentWill.SpendingRule[] memory spendingRules = new AgentWill.SpendingRule[](1);
        spendingRules[0] = AgentWill.SpendingRule({
            token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,
            dailyLimit: 1000e6,
            perTxLimit: 100e6,
            currentDailySpend: 0,
            lastResetTime: 0
        });

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test")),
            spendingRules,
            new AgentWill.InteractionRule[](0),
            true
        );

        (bool allowed, string memory reason) = agentWill.verifySpending(
            ruleSetId, agent, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 50e6
        );

        assertTrue(allowed);
        assertEq(bytes(reason).length, 0);
    }

    function testVerifySpendingExceedsPerTxLimit() public {
        AgentWill.SpendingRule[] memory spendingRules = new AgentWill.SpendingRule[](1);
        spendingRules[0] = AgentWill.SpendingRule({
            token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,
            dailyLimit: 1000e6,
            perTxLimit: 100e6,
            currentDailySpend: 0,
            lastResetTime: 0
        });

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test")),
            spendingRules,
            new AgentWill.InteractionRule[](0),
            true
        );

        (bool allowed, string memory reason) = agentWill.verifySpending(
            ruleSetId, agent, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 200e6
        );

        assertFalse(allowed);
    }

    function testVerifySpendingExceedsDailyLimit() public {
        AgentWill.SpendingRule[] memory spendingRules = new AgentWill.SpendingRule[](1);
        spendingRules[0] = AgentWill.SpendingRule({
            token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,
            dailyLimit: 100e6,
            perTxLimit: 100e6,
            currentDailySpend: 0,
            lastResetTime: 0
        });

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test")),
            spendingRules,
            new AgentWill.InteractionRule[](0),
            true
        );

        (bool allowed1, ) = agentWill.verifySpending(
            ruleSetId, agent, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 50e6
        );
        assertTrue(allowed1);

        (bool allowed2, ) = agentWill.verifySpending(
            ruleSetId, agent, 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 60e6
        );
        assertFalse(allowed2);
    }

    function testVerifyInteractionAllowed() public {
        AgentWill.InteractionRule[] memory interactionRules = new AgentWill.InteractionRule[](1);
        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = bytes4(keccak256("swap(address,uint256)"));
        interactionRules[0] = AgentWill.InteractionRule({
            target: 0x2626664c2603336E57B271c5C0b26F421741e481,
            allowed: true,
            selectors: selectors
        });

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test")),
            new AgentWill.SpendingRule[](0),
            interactionRules,
            true
        );

        (bool allowed, ) = agentWill.verifyInteraction(
            ruleSetId, agent, 0x2626664c2603336E57B271c5C0b26F421741e481,
            bytes4(keccak256("swap(address,uint256)"))
        );

        assertTrue(allowed);
    }

    function testVerifyInteractionBlocked() public {
        AgentWill.InteractionRule[] memory interactionRules = new AgentWill.InteractionRule[](1);
        interactionRules[0] = AgentWill.InteractionRule({
            target: 0x2626664c2603336E57B271c5C0b26F421741e481,
            allowed: false,
            selectors: new bytes4[](0)
        });

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test")),
            new AgentWill.SpendingRule[](0),
            interactionRules,
            true
        );

        (bool allowed, ) = agentWill.verifyInteraction(
            ruleSetId, agent, 0x2626664c2603336E57B271c5C0b26F421741e481,
            bytes4(0)
        );

        assertFalse(allowed);
    }

    function testUpdateRuleSet() public {
        AgentWill.SpendingRule[] memory spendingRules = new AgentWill.SpendingRule[](1);
        spendingRules[0] = AgentWill.SpendingRule({
            token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,
            dailyLimit: 100e6,
            perTxLimit: 50e6,
            currentDailySpend: 0,
            lastResetTime: 0
        });

        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("v1")),
            spendingRules,
            new AgentWill.InteractionRule[](0),
            true
        );

        AgentWill.SpendingRule[] memory newRules = new AgentWill.SpendingRule[](1);
        newRules[0] = AgentWill.SpendingRule({
            token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,
            dailyLimit: 500e6,
            perTxLimit: 200e6,
            currentDailySpend: 0,
            lastResetTime: 0
        });

        vm.prank(owner);
        agentWill.updateRuleSet(
            ruleSetId,
            keccak256(abi.encode("v2")),
            newRules,
            new AgentWill.InteractionRule[](0),
            false
        );

        AgentWill.RuleSet memory rs = agentWill.getRuleSet(ruleSetId);
        assertEq(rs.spendingRules[0].dailyLimit, 500e6);
        assertFalse(rs.revealMetadata);
    }

    function testSetRuleSetActive() public {
        vm.prank(owner);
        uint256 ruleSetId = agentWill.createRuleSet(
            agent,
            keccak256(abi.encode("test")),
            new AgentWill.SpendingRule[](0),
            new AgentWill.InteractionRule[](0),
            true
        );

        vm.prank(owner);
        agentWill.setRuleSetActive(ruleSetId, false);

        AgentWill.RuleSet memory rs = agentWill.getRuleSet(ruleSetId);
        assertFalse(rs.isActive);

        (bool allowed, ) = agentWill.verifySpending(
            ruleSetId, agent, address(0), 0
        );
        assertFalse(allowed);
    }
}
