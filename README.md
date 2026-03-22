# AgentWill

> On-chain rules for AI agents — the missing primitive between human intentions and agent actions.

## Problem

AI agents are already moving money, calling services, and making commitments on behalf of humans. But there is **no enforceable layer** between a human's intentions and an agent's actions:

- No transparent way to define what an agent is allowed to do
- No way to verify it stayed within bounds
- No recourse if it didn't

The result: humans either babysit their agents constantly, or hand over control entirely and hope for the best.

## Solution

AgentWill gives humans a **signed, on-chain rule set** — like a legal will — that defines exactly what your agent can spend, who it can interact with, what it can reveal, and what happens when it makes a deal.

The agent operates freely and autonomously **within those rules**. Every action is **verifiable on-chain**. The human stays in control without having to watch.

## Architecture

```
Human defines rules → Rules deployed on-chain (Base) → Agent queries rules before each action → Every action logged & verified
```

### Smart Contracts

| Contract | Purpose |
|----------|---------|
| `AgentWill.sol` | Core rule engine — spending limits, interaction rules, privacy controls |
| `AgentIdentity.sol` | On-chain agent identity with signature verification |

### Key Features

- **Spending Controls**: Per-token daily limits, per-transaction caps
- **Interaction Rules**: Whitelist/blacklist contract addresses and function selectors
- **Privacy Controls**: Configurable metadata reveal on-chain
- **On-Chain Verification**: Every agent action verified against rules via smart contract calls
- **ERC-8004 Compatible**: Agent identity built for the ERC-8004 standard

## Tech Stack

- **Smart Contracts**: Solidity 0.8.24, OpenZeppelin
- **Chain**: Base (Ethereum L2)
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, viem
- **Testing**: Foundry (Forge)
- **Deployment**: Vercel + Base mainnet

## Quick Start

### Setup

```bash
npm install
cd frontend && npm install
```

### Run Tests

```bash
forge test
```

### Build Contracts

```bash
forge build
```

### Run Frontend Locally

```bash
cd frontend && npm run dev
```

### Deploy Contracts to Base

```bash
export PRIVATE_KEY=0x...
export BASE_RPC_URL=https://mainnet.base.org
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

## Project Structure

```
agentwill/
├── src/
│   ├── AgentWill.sol         # Core rule engine contract
│   ├── AgentIdentity.sol     # Agent identity contract
│   └── interfaces/           # Interface definitions
├── test/
│   └── AgentWill.t.sol       # Contract tests (8 passing)
├── script/
│   └── Deploy.s.sol          # Deployment script
└── frontend/
    ├── app/
    │   ├── page.tsx           # Main UI
    │   └── globals.css        # Styles
    └── package.json
```

## Tracks

AgentWill is submitted to:
- **Agents With Receipts — ERC-8004** (Protocol Labs)
- **stETH Agent Treasury** (Lido Labs)
- **Best Use of Delegations** (MetaMask)
- **Agent Services on Base** (Base)
- **Synthesis Open Track**

## License

MIT
