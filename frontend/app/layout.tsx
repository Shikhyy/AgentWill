import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'AgentWill — On-Chain Rules for AI Agents',
  description: 'Define what your AI agent can do, on-chain. Every action verifiable. You stay in control. Built for Base.',
  keywords: 'AI agents, blockchain, Ethereum, Base, smart contracts, agent governance, ERC-8004',
  openGraph: {
    title: 'AgentWill — On-Chain Rules for AI Agents',
    description: 'The missing primitive between human intentions and agent actions.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
