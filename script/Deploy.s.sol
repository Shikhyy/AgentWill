// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { AgentWill } from "../src/AgentWill.sol";
import { AgentIdentity } from "../src/AgentIdentity.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("BASE_RPC_URL");

        console2.log("Using RPC:", rpcUrl);

        vm.startBroadcast(deployerPrivateKey);

        AgentIdentity agentIdentity = new AgentIdentity();
        agentIdentity.initialize(address(0));

        AgentWill agentWill = new AgentWill();
        agentWill.initialize();

        console2.log("AgentIdentity deployed at:", address(agentIdentity));
        console2.log("AgentWill deployed at:", address(agentWill));

        vm.stopBroadcast();
    }
}
