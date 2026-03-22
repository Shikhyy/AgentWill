import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgentWill — On-Chain Rules for AI Agents',
  description: 'Define what your AI agent can do, on-chain. Every action verifiable. You stay in control.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
