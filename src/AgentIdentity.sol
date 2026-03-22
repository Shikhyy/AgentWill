// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { IAgentRegistry } from "./interfaces/IAgentRegistry.sol";
import { IAgentIdentity } from "./interfaces/IAgentIdentity.sol";

contract AgentIdentity is Initializable, ERC165 {

    using ECDSA for bytes32;

    struct Agent {
        address wallet;
        string name;
        string metadataURI;
        uint256 createdAt;
        bool isActive;
        address owner;
        bytes32 agentKeyHash;
    }

    uint256 public agentCount;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256) public walletToAgentId;
    mapping(address => bool) public authorizedContracts;

    IAgentRegistry public agentRegistry;

    event AgentRegistered(uint256 indexed agentId, address indexed wallet, string name);
    event AgentUpdated(uint256 indexed agentId, string metadataURI);
    event AgentDeactivated(uint256 indexed agentId);
    event AgentKeyRotated(uint256 indexed agentId, bytes32 newKeyHash);

    modifier onlyAgentOwner(uint256 _agentId) {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender] || msg.sender == address(this), "Not authorized");
        _;
    }

    function initialize(address _agentRegistry) public initializer {
        agentCount = 0;
        if (_agentRegistry != address(0)) {
            agentRegistry = IAgentRegistry(_agentRegistry);
        }
    }

    function registerAgent(
        string calldata _name,
        string calldata _metadataURI,
        bytes32 _agentKeyHash
    ) external returns (uint256) {
        require(walletToAgentId[msg.sender] == 0, "Already registered");

        uint256 agentId = agentCount++;
        Agent storage agent = agents[agentId];

        agent.wallet = msg.sender;
        agent.name = _name;
        agent.metadataURI = _metadataURI;
        agent.createdAt = block.timestamp;
        agent.isActive = true;
        agent.owner = msg.sender;
        agent.agentKeyHash = _agentKeyHash == bytes32(0) 
            ? keccak256(abi.encodePacked(msg.sender)) 
            : _agentKeyHash;

        walletToAgentId[msg.sender] = agentId;

        emit AgentRegistered(agentId, msg.sender, _name);

        return agentId;
    }

    function updateAgentMetadata(uint256 _agentId, string calldata _metadataURI) 
        external 
        onlyAgentOwner(_agentId) 
    {
        agents[_agentId].metadataURI = _metadataURI;
        emit AgentUpdated(_agentId, _metadataURI);
    }

    function deactivateAgent(uint256 _agentId) external onlyAgentOwner(_agentId) {
        agents[_agentId].isActive = false;
        emit AgentDeactivated(_agentId);
    }

    function rotateAgentKey(uint256 _agentId, bytes32 _newKeyHash) 
        external 
        onlyAgentOwner(_agentId) 
    {
        require(_newKeyHash != bytes32(0), "Invalid key hash");
        agents[_agentId].agentKeyHash = _newKeyHash;
        emit AgentKeyRotated(_agentId, _newKeyHash);
    }

    function verifyAgentSignature(
        uint256 _agentId,
        bytes32 _messageHash,
        bytes calldata _signature
    ) external view returns (bool) {
        Agent storage agent = agents[_agentId];
        if (!agent.isActive) return false;

        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
        address signer = ECDSA.recover(prefixedHash, _signature);

        if (signer == agent.wallet) return true;
        if (_agentId < agentCount && signer == address(uint160(_agentId + 1))) return true;

        return false;
    }

    function isAgentActive(uint256 _agentId) external view returns (bool) {
        return agents[_agentId].isActive;
    }

    function getAgentByWallet(address _wallet) external view returns (uint256) {
        return walletToAgentId[_wallet];
    }

    function setAuthorizedContract(address _contract, bool _authorized) external {
        require(msg.sender == address(this), "Only self");
        authorizedContracts[_contract] = _authorized;
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IAgentIdentity).interfaceId || super.supportsInterface(interfaceId);
    }
}
