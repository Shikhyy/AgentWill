# AgentWill

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.24-blue" alt="Solidity">
  <img src="https://img.shields.io/badge/Chain-Base-purple" alt="Chain">
  <img src="img.shields.io/badge/Tests-8%20passing-green" alt="Tests">
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License">
  <img src="https://img.shields.io/badge/ERC-8004%20Compatible-cyan" alt="ERC-8004">
</p>

> **On-chain rules for AI agents** — the missing primitive between human intentions and agent actions.

---

## The Problem

AI agents are already moving money, calling services, and making commitments on behalf of humans. But there is **no enforceable layer** between a human's intentions and an agent's actions.

When you give an agent access to your wallet or APIs, you're handing it a **blank cheque**:

- **No way to define** what it's allowed to do
- **No way to verify** it stayed within bounds
- **No recourse** if it didn't
- **Every API call leaks** your spending patterns, contacts, and behavior

The infrastructure agents run on today was built for **humans, not machines**. Centralized providers can revoke access, block transactions, and surveil activity.

> Humans are either forced to babysit their agents constantly, or hand over control entirely and hope for the best. **Neither is acceptable.**

---

## The Solution

AgentWill gives humans a **signed, on-chain rule set** — like a legal will — that defines exactly what your agent can spend, who it can interact with, what it can reveal, and what happens when it makes a deal.

The agent operates freely and autonomously **within those rules**. Every action is **verifiable on-chain**. The human stays in control without having to watch.

```
┌─────────────────────────────────────────────────────────────────┐
│                      AgentWill Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Human          AgentWill Contract         Agent                │
│     │                   │                    │                   │
│     │── define rules ──▶│                    │                   │
│     │                   │                    │                   │
│     │                   │◀── query rules ────│                   │
│     │                   │                    │                   │
│     │                   │─── allow/block ────▶│                   │
│     │                   │                    │                   │
│     │                   │◀── execute tx ─────│                   │
│     │                   │                    │                   │
│     │◀── on-chain log ──│                    │                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 💰 Spending Controls
Per-token daily limits and per-transaction caps. Your agent can spend freely within the boundaries you set — nothing more.

### 🌐 Interaction Rules
Whitelist or blacklist specific contract addresses and function selectors. Control exactly which protocols your agent can call.

### 🔒 Privacy Controls
Choose what metadata your agent reveals on-chain. Keep spending patterns and behavior private when needed.

### ✅ On-Chain Verification
Every agent action is verified against the smart contract before execution. All activity is logged immutably on Base.

### 🤖 ERC-8004 Compatible
Built for the ERC-8004 agent identity standard. Your agent gets a real on-chain identity it carries everywhere.

---

## Smart Contracts

| Contract | Description |
|----------|-------------|
| [`AgentWill.sol`](src/AgentWill.sol) | Core rule engine. Manages rule sets, verifies spending and interaction permissions, enforces limits, emits on-chain events. |
| [`AgentIdentity.sol`](src/AgentIdentity.sol) | On-chain agent identity with EIP-712 signature verification. Links agents to wallets via ERC-8004 compatible model. |

### Contract Architecture

```
AgentWill.sol
├── createRuleSet()      → Deploy a new rule set for an agent
├── updateRuleSet()      → Modify an existing rule set
├── verifySpending()     → Check if a spending action is allowed
├── verifyInteraction()  → Check if a contract call is allowed
├── setRuleSetActive()   → Toggle a rule set on/off
└── Events               → ActionVerified, InteractionVerified, RuleSetCreated

AgentIdentity.sol
├── registerAgent()         → Register an agent with on-chain identity
├── updateAgentMetadata()    → Update agent metadata URI
├── deactivateAgent()        → Revoke agent identity
├── verifyAgentSignature()   → EIP-712 signature verification
└── rotateAgentKey()         → Rotate agent signing key
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Solidity `0.8.24`, OpenZeppelin `5.x` |
| Chain | Base (Ethereum L2) |
| Frontend | Next.js `14`, TypeScript, Tailwind CSS |
| Ethereum Kit | `viem` + `wagmi` |
| Testing | Foundry (Forge) — 8/8 tests passing |
| Deployment | Vercel + Base Sepolia |

---

## Getting Started

### 1. Install Dependencies

```bash
# Clone the repo
git clone https://github.com/Shikhyy/AgentWill.git
cd AgentWill

# Install frontend dependencies
cd frontend && npm install
```

### 2. Run Tests

```bash
forge test
```

**Test Coverage:**
- ✅ Rule set creation
- ✅ Spending verification within limits
- ✅ Per-transaction limit enforcement
- ✅ Daily limit enforcement
- ✅ Interaction whitelist
- ✅ Interaction blacklist
- ✅ Rule set updates
- ✅ Rule set activation/deactivation

### 3. Deploy Contracts

```bash
# Copy environment file
cp .env.example .env

# Fill in your credentials:
#   PRIVATE_KEY=0x...
#   BASE_RPC_URL=https://sepolia.base.org

# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify

# Deploy to Base Mainnet
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

### 4. Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

---

## Project Structure

```
agentwill/
├── src/
│   ├── AgentWill.sol              # Core rule engine
│   ├── AgentIdentity.sol          # Agent identity (ERC-8004)
│   └── interfaces/
│       ├── IAgentWill.sol        # AgentWill interface
│       ├── IAgentIdentity.sol     # AgentIdentity interface
│       ├── IAgentRegistry.sol     # Registry interface
│       └── IAgentRule.sol         # Rule interface
│
├── test/
│   └── AgentWill.t.sol           # 8 passing Foundry tests
│
├── script/
│   └── Deploy.s.sol             # Deployment script
│
├── lib/                          # OpenZeppelin, forge-std
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Main landing page
│   │   └── globals.css           # Global styles
│   ├── public/                  # Static assets
│   ├── package.json
│   └── ...                      # Next.js config
│
├── README.md
├── foundry.toml
└── .env.example
```

---

## Live Demo

**Frontend:** https://frontend-kixor2lhj-shikhar-vermas-projects-58dc0c80.vercel.app

The live demo includes:
- Interactive rule creation interface
- Real-time rule management
- Activity monitoring dashboard
- Full landing page with feature showcase

---

## Hackathon Submission

AgentWill is submitted to **5 tracks** at [The Synthesis Hackathon 2026](https://synthesis.md):

| Track | Prize Pool |
|-------|-----------|
| 🏆 Agents With Receipts — ERC-8004 (Protocol Labs) | $4,000 |
| 🏆 stETH Agent Treasury (Lido Labs) | $3,000 |
| 🏆 Agent Services on Base (Coinbase) | $5,000 |
| 🏆 Best Use of Delegations (MetaMask) | TBD |
| 🏆 Synthesis Open Track | Community funded |

---

## How It Works (Deep Dive)

### Creating a Rule Set

```solidity
// Define spending rules
SpendingRule[] memory spendingRules = new SpendingRule[](1);
spendingRules[0] = SpendingRule({
    token: USDC_ADDRESS,
    dailyLimit: 1000e6,      // $1,000/day
    perTxLimit: 100e6,       // $100/tx
    currentDailySpend: 0,
    lastResetTime: 0
});

// Define interaction rules
InteractionRule[] memory interactionRules = new InteractionRule[](1);
interactionRules[0] = InteractionRule({
    target: UNISWAP_ROUTER,
    allowed: true,
    selectors: new bytes4[](0)  // Allow all functions
});

// Deploy rule set
agentWill.createRuleSet(
    agentAddress,
    keccak256(abi.encode("v1")),
    spendingRules,
    interactionRules,
    false  // revealMetadata
);
```

### Agent Verifies Before Every Action

```solidity
// Agent checks before spending
(bool allowed, string memory reason) = agentWill.verifySpending(
    ruleSetId,
    agentAddress,
    USDC_ADDRESS,
    50e6  // $50
);

require(allowed, reason);  // Reverts if outside rules
// ... execute the actual transaction
```

---

## Why Base?

- **Low fees** — fractions of a cent per transaction
- **Coinbase backing** — institutional-grade infrastructure
- **Ethereum security** — inherits Ethereum's finality
- **ERC-8004 native** — agent identity standards work out of the box

---

## Roadmap

- [ ] Deploy contracts to Base mainnet
- [ ] Integrate wagmi + WalletConnect for wallet connection
- [ ] Build agent SDK for easy integration
- [ ] Add ERC-8004 registry integration
- [ ] Multi-agent coordination support
- [ ]ZK-based privacy proofs for rule verification

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License — see [LICENSE](LICENSE)

---

<p align="center">
  <strong>Built for The Synthesis Hackathon 2026</strong>
  <br>
  Shikhar Verma — <a href="https://twitter.com/Shikhyyy">@Shikhyyy</a>
</p>
