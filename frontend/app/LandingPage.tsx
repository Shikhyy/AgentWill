'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import Link from 'next/link'
import { useWallet } from '@/components/Providers'
import { createRuleSetTx, getRuleSetsByAgent, getRuleSet, revokeRuleSetTx, formatUnits, parseTokenAmount, TOKENS } from '@/lib/wagmi'

function ShieldIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
}
function WalletIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><circle cx="18" cy="14" r="2"/></svg>
}
function GlobeIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
}
function LockIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
function ActivityIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
}
function BotIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
}
function CodeIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
}
function ZapIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
}
function CheckIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function XIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function ArrowRIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
}
function GithubIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
}
function MenuIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
}
function StarIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function ChevronDownIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
}
function UserIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function AlertIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function BaseIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="11" fill="#0052FF" opacity="0.15"/><text x="12" y="16" textAnchor="middle" fill="#0052FF" fontSize="12" fontWeight="bold">b</text></svg>
}

function Particles() {
  const [particles, setP] = useState<{ x: number; y: number; s: number; sp: number; o: number }[]>([])
  useEffect(() => {
    setP(Array.from({ length: 50 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      s: Math.random() * 2 + 0.5, sp: Math.random() * 20 + 10,
      o: Math.random() * 0.3 + 0.05,
    })))
  }, [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s,
          background: i % 4 === 0 ? '#8fae87' : i % 4 === 1 ? '#c9a84c' : i % 4 === 2 ? '#6b9080' : '#d4a84b',
          opacity: p.o, animation: `float ${p.sp}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`,
        }} />
      ))}
    </div>
  )
}

function FadeIn({ children, className = '', delay = 0, from = 'bottom' }: {
  children: ReactNode; className?: string; delay?: number; from?: 'bottom' | 'left' | 'right' | 'scale'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const tfs: Record<string, string> = { bottom: 'translateY(50px)', left: 'translateX(-50px)', right: 'translateX(50px)', scale: 'scale(0.92)' }
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0, transform: v ? 'translate(0) scale(1)' : tfs[from],
      transitionDuration: '0.7s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${delay}ms`,
    }}>{children}</div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false), [open, setOpen] = useState(false)
  const { address, connecting, connect } = useWallet()
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn) }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a7c59] to-[#2d5239] flex items-center justify-center shadow-lg shadow-[#4a7c59]/20 group-hover:shadow-[#4a7c59]/35 transition-all group-hover:scale-105">
            <ShieldIcon c="w-5 h-5 text-[#e8d5a3]" />
          </div>
          <span className="text-xl font-bold tracking-tight">AgentWill</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors">How it Works</a>
          <a href="#compare" className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors">Comparison</a>
          <a href="#faq" className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors">FAQ</a>
          <a href="https://github.com/Shikhyy/AgentWill" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors flex items-center gap-1.5">
            <GithubIcon c="w-4 h-4" /> GitHub
          </a>
          {address ? (
            <a href="#demo" className="btn-primary text-sm !py-2.5 !px-5">
              <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
            </a>
          ) : (
            <button onClick={connect} disabled={connecting}
              className="btn-primary text-sm !py-2.5 !px-5 disabled:opacity-50">
              <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <XIcon c="w-6 h-6" /> : <MenuIcon c="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4 animate-slide-up">
          <a href="#features" className="text-[#8fae87]" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-[#8fae87]" onClick={() => setOpen(false)}>How it Works</a>
          <a href="#compare" className="text-[#8fae87]" onClick={() => setOpen(false)}>Comparison</a>
          <a href="#faq" className="text-[#8fae87]" onClick={() => setOpen(false)}>FAQ</a>
          {address ? (
            <a href="#demo" className="btn-primary text-center" onClick={() => setOpen(false)}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </a>
          ) : (
            <button onClick={() => { connect(); setOpen(false) }} className="btn-primary text-center">
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid">
      <Particles />
      <div className="scan-line" />
      <div className="blob w-[600px] h-[600px] bg-[#4a7c59]/8 -top-48 -left-48" />
      <div className="blob w-[400px] h-[400px] bg-[#c9a84c]/6 top-1/3 -right-32" />
      <div className="blob w-[300px] h-[300px] bg-[#6b9080]/5 bottom-20 left-1/4" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c59]/25 bg-[#4a7c59]/8 text-sm text-[#8fae87] mb-8 animate-slide-up">
          <ZapIcon c="w-4 h-4 text-[#c9a84c]" />
          <span>Built for The Synthesis Hackathon 2026</span>
          <span className="w-2 h-2 rounded-full bg-[#6b9080] animate-pulse-dot" />
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.02] animate-slide-up" style={{ animationDelay: '100ms' }}>
          On-Chain Rules<br />
          <span className="gradient-text">for AI Agents</span>
        </h1>
        <p className="text-lg md:text-xl text-[#6b9080] max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
          Define exactly what your AI agent can spend, who it can interact with, and what it can reveal.
          Every action verifiable on Base. You stay in control.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <a href="#demo" className="btn-primary text-lg group flex items-center gap-2">
            <span>Launch Dashboard</span>
            <ArrowRIcon c="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="https://github.com/Shikhyy/AgentWill" target="_blank" rel="noopener noreferrer" className="btn-secondary text-lg flex items-center gap-2">
            <GithubIcon c="w-5 h-5" /><span>View on GitHub</span>
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
          {[['Base L2', 'Chain'], ['8/8', 'Tests'], ['ERC-8004', 'Standard'], ['Solidity', 'Language']].map(([val, label], i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-[#8fae87]">{val}</div>
              <div className="text-xs text-[#4a7c59] uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
        <FadeIn delay={500} className="max-w-2xl mx-auto">
          <div className="code-block">
            <div className="code-block-header">
              <div className="w-3 h-3 rounded-full bg-[#c97b7b]/60" />
              <div className="w-3 h-3 rounded-full bg-[#c9a84c]/60" />
              <div className="w-3 h-3 rounded-full bg-[#6b9080]/60" />
              <span className="text-xs text-[#4a7c59] ml-2 font-mono">agentwill.config.ts</span>
            </div>
            <div className="code-block-body text-left">
              <div><span className="text-[#6b9080]">const</span> <span className="text-[#c9a84c]">ruleSet</span> = {'{'}</div>
              <div className="pl-6"><span className="text-[#8fae87]">spending</span>: {'{'} <span className="text-[#d4a84b]">dailyLimit</span>: <span className="text-[#c9a84c]">"$1,000"</span>, <span className="text-[#d4a84b]">perTx</span>: <span className="text-[#c9a84c]">"$100"</span> {'}'},</div>
              <div className="pl-6"><span className="text-[#8fae87]">interactions</span>: [<span className="text-[#c9a84c]">"UniswapRouter"</span>, <span className="text-[#c9a84c]">"Aerodrome"</span>],</div>
              <div className="pl-6"><span className="text-[#8fae87]">privacy</span>: <span className="text-[#c9a84c]">"strict"</span></div>
              <div>{'}'}</div>
              <div className="mt-2 text-[#6b9080]">await</div>
              <div className="pl-6"><span className="text-[#c9a84c]">agentWill</span>.<span className="text-[#d4a84b]">deploy</span>(ruleSet)</div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6b9080] animate-pulse-dot" />
                <span className="text-[#4a7c59] text-xs">Rule set deployed on Base</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border border-[#4a7c59]/25 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-[#4a7c59]/50 animate-pulse" />
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a84c]/5 to-transparent" />
      <div className="blob w-[400px] h-[400px] bg-[#c9a84c]/5 -top-32 right-0" />
      <div className="relative max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/8 text-sm text-[#c9a84c] mb-6">
            <AlertIcon c="w-4 h-4" />The Problem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Agents have <span className="gradient-text-warm">blank cheque</span> access
          </h2>
          <p className="text-[#6b9080] max-w-2xl mx-auto text-lg">
            When you give an agent access to your wallet, there is nothing enforcing what it can and cannot do.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: WalletIcon, title: 'No Spending Limits', desc: 'Your agent can drain your entire wallet. No per-transaction caps, no daily limits, no boundaries.', col: 'gold' },
            { Icon: GlobeIcon, title: 'No Interaction Controls', desc: 'Agents call any contract, any function. No way to whitelist or blacklist specific protocols.', col: 'rose' },
            { Icon: LockIcon, title: 'No Privacy', desc: 'Every API call leaks your spending patterns, contacts, and behavior. You never consented to that exposure.', col: 'sage' },
          ].map(({ Icon, title, desc, col }, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="border-gradient p-8 h-full card-hover">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  col === 'gold' ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20' :
                  col === 'rose' ? 'bg-[#c97b7b]/10 text-[#c97b7b] border border-[#c97b7b]/20' :
                  'bg-[#6b9080]/10 text-[#8fae87] border border-[#6b9080]/20'
                }`}>
                  <Icon c="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-[#6b9080] leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={400} className="mt-16">
          <div className="border-gradient p-8 md:p-12 text-center">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#8fae87]">
              Humans are either forced to <span className="text-[#c9a84c] font-bold">babysit their agents constantly</span>,
              or hand over control entirely and <span className="text-[#c97b7b] font-bold">hope for the best</span>.
            </p>
            <p className="text-lg mt-4 text-[#6b9080]">
              Neither is acceptable as agents become more capable and autonomous.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { Icon: WalletIcon, title: 'Spending Controls', desc: 'Per-token daily limits and per-transaction caps. Agent spends freely within your boundaries.', col: 'sage', badge: 'CORE' },
    { Icon: GlobeIcon, title: 'Interaction Rules', desc: 'Whitelist or blacklist contracts and function selectors. Full scope control over agent behavior.', col: 'gold', badge: '' },
    { Icon: LockIcon, title: 'Privacy Controls', desc: 'Choose what metadata your agent reveals on-chain. Keep patterns and behavior private.', col: 'cream', badge: '' },
    { Icon: ShieldIcon, title: 'On-Chain Verification', desc: 'Every action verified against smart contract before execution. All logs immutable on Base.', col: 'rose', badge: '' },
    { Icon: BotIcon, title: 'ERC-8004 Identity', desc: 'On-chain agent identity built for the ERC-8004 standard. Real identity, portable everywhere.', col: 'gold', badge: 'ERC-8004' },
    { Icon: ActivityIcon, title: 'Activity Dashboard', desc: 'Real-time monitoring of every agent action. See what was allowed, blocked, and why.', col: 'sage', badge: '' },
  ]
  const colMap: Record<string, string> = {
    sage: 'bg-[#6b9080]/10 text-[#8fae87] border border-[#6b9080]/20',
    gold: 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20',
    cream: 'bg-[#e8d5a3]/10 text-[#e8d5a3] border border-[#e8d5a3]/20',
    rose: 'bg-[#c97b7b]/10 text-[#c97b7b] border border-[#c97b7b]/20',
  }
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="blob w-[500px] h-[500px] bg-[#4a7c59]/6 -top-48 -right-48" />
      <div className="blob w-[300px] h-[300px] bg-[#c9a84c]/4 -bottom-32 left-0" />
      <div className="relative max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c59]/25 bg-[#4a7c59]/8 text-sm text-[#8fae87] mb-4">Features</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything an agent needs to stay <span className="gradient-text">accountable</span>
          </h2>
          <p className="text-[#6b9080] max-w-2xl mx-auto text-lg">
            AgentWill is the single infrastructure layer addressing spending, interaction, privacy, and accountability — all at once.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ Icon, title, desc, col, badge }, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="glass rounded-2xl p-6 h-full card-hover group relative">
                {badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#4a7c59]/15 text-[#8fae87] border border-[#4a7c59]/25">
                      {badge}
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${colMap[col]}`}>
                  <Icon c="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-[#8fae87] transition-colors">{title}</h3>
                <p className="text-sm text-[#6b9080] leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  return (
    <section id="compare" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4a7c59]/5 to-transparent" />
      <div className="relative max-w-5xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c59]/25 bg-[#4a7c59]/8 text-sm text-[#8fae87] mb-4">Before vs After</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Before AgentWill <span className="text-[#c97b7b]">vs</span> After AgentWill
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              items: ['Agent has unlimited wallet access', 'No spending controls or limits', 'Any contract can be called', 'All activity leaks metadata', 'No way to verify agent behavior', 'Human must babysit constantly'],
              label: 'Without AgentWill', sub: 'The old way', color: 'rose', ok: false
            },
            {
              items: ['Agent operates within defined rules', 'Per-token daily & per-tx limits', 'Only whitelisted contracts callable', 'Configurable privacy controls', 'Every action logged on-chain', 'Human stays in control, passively'],
              label: 'With AgentWill', sub: 'The right way', color: 'sage', ok: true
            },
          ].map(({ items, label, sub, color, ok }, idx) => (
            <FadeIn key={idx} delay={idx * 150} from={idx === 0 ? 'left' : 'right'}>
              <div className={`rounded-2xl p-8 h-full relative overflow-hidden ${
                ok ? 'border border-[#4a7c59]/20 bg-[#4a7c59]/5' : 'border border-[#c97b7b]/20 bg-[#c97b7b]/5'
              }`}>
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  ok ? 'bg-gradient-to-r from-[#4a7c59] to-transparent' : 'bg-gradient-to-r from-[#c97b7b] to-transparent'
                }`} />
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ok ? 'bg-[#4a7c59]/20 text-[#8fae87]' : 'bg-[#c97b7b]/20 text-[#c97b7b]'
                  }`}>
                    {ok ? <CheckIcon c="w-5 h-5" /> : <XIcon c="w-5 h-5" />}
                  </div>
                  <div>
                    <div className={`font-bold ${ok ? 'text-[#8fae87]' : 'text-[#c97b7b]'}`}>{label}</div>
                    <div className={`text-xs ${ok ? 'text-[#4a7c59]' : 'text-[#c97b7b]/60'}`}>{sub}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 ${ok ? 'text-[#6b9080]' : 'text-[#c97b7b]/60'}`}>
                        {ok ? <CheckIcon c="w-4 h-4" /> : <XIcon c="w-4 h-4" />}
                      </div>
                      <span className={`text-sm ${ok ? 'text-[#8fae87]/80' : 'text-[#6b9080]/60'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Define Your Rules', desc: 'Set spending limits, interaction permissions, and privacy controls through a clean interface. No code required.' },
    { n: '02', title: 'Deploy On-Chain', desc: 'Rules compile to an immutable smart contract on Base. Survives any platform, any provider.' },
    { n: '03', title: 'Agent Operates', desc: 'Agent queries the contract before each action. Contract allows or blocks — permanently logged.' },
    { n: '04', title: 'You Stay in Control', desc: 'Monitor activity in real-time. Update rules anytime. Revoke access instantly if needed.' },
  ]
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="blob w-[400px] h-[400px] bg-[#4a7c59]/5 top-0 left-1/2 -translate-x-1/2" />
      <div className="relative max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c59]/25 bg-[#4a7c59]/8 text-sm text-[#8fae87] mb-4">How it Works</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple by design</h2>
          <p className="text-[#6b9080] max-w-2xl mx-auto text-lg">From rule definition to on-chain enforcement in minutes.</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="glass rounded-2xl p-6 h-full card-hover relative">
                <div className="text-6xl font-black text-[#4a7c59]/15 mb-4">{s.n}</div>
                <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                <p className="text-sm text-[#6b9080] leading-relaxed">{s.desc}</p>
                {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2"><ArrowRIcon c="w-5 h-5 text-[#4a7c59]/20" /></div>}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { label: 'Chain', val: 'Base', suffix: ' Sepolia' },
    { label: 'Tests Passing', val: '8', suffix: '/8' },
    { label: 'Smart Contracts', val: '2', suffix: '' },
    { label: 'Agent Standard', val: 'ERC', suffix: '-8004' },
  ]
  return (
    <section className="relative py-20">
      <div className="border-y border-[#4a7c59]/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 80} className="text-center">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">{s.val}{s.suffix}</div>
                <div className="text-sm text-[#4a7c59] uppercase tracking-widest">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DemoSection() {
  const [tab, setTab] = useState<'create' | 'manage'>('create')
  const [agentId, setAgentId] = useState('')
  const [rules, setRules] = useState([{ token: 'USDC', daily: '1000', perTx: '100' }])
  const [reveal, setReveal] = useState(false)
  const [done, setDone] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [deployError, setDeployError] = useState('')
  const [manageId, setManageId] = useState('')
  const [existingRules, setExistingRules] = useState<any[]>([])
  const [loadingRules, setLoadingRules] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const { address } = useWallet()
  const addRule = () => setRules([...rules, { token: 'ETH', daily: '0.5', perTx: '0.1' }])
  const upd = (i: number, f: string, v: string) => { const u = [...rules]; u[i] = { ...u[i], [f]: v }; setRules(u) }
  const rm = (i: number) => setRules(rules.filter((_, j) => j !== i))

  const handleDeploy = async () => {
    if (!address) return
    setDeploying(true)
    setDeployError('')
    try {
      const spendingRules = rules.map(r => ({
        token: TOKENS[r.token].address as `0x${string}`,
        dailyLimit: parseTokenAmount(r.daily, r.token),
        perTxLimit: parseTokenAmount(r.perTx, r.token),
      }))
      const hash = await createRuleSetTx(
        agentId as `0x${string}`,
        spendingRules,
        [],
        reveal
      )
      setTxHash(hash)
      setDone(true)
    } catch (e: any) {
      setDeployError(e.message || 'Transaction failed. Contract may not be deployed yet.')
    } finally {
      setDeploying(false)
    }
  }

  const handleLoadRules = async () => {
    if (!manageId) return
    setLoadingRules(true)
    try {
      const ruleSetIds = await getRuleSetsByAgent(manageId as `0x${string}`)
      const loaded = await Promise.all(
        (ruleSetIds as bigint[]).map(id => getRuleSet(id))
      )
      setExistingRules(loaded)
    } catch (e) {
      setExistingRules([])
    } finally {
      setLoadingRules(false)
    }
  }

  const handleRevokeAll = async () => {
    if (!address || existingRules.length === 0) return
    setRevoking(true)
    try {
      for (const r of existingRules) {
        if (r.isActive) {
          await revokeRuleSetTx(r.ruleSetId)
        }
      }
      setExistingRules([])
    } catch (e) {
      console.error(e)
    } finally {
      setRevoking(false)
    }
  }

  return (
    <section id="demo" className="relative py-32 overflow-hidden">
      <div className="blob w-[600px] h-[600px] bg-[#4a7c59]/5 -top-48 left-1/2 -translate-x-1/2" />
      <div className="relative max-w-4xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c59]/25 bg-[#4a7c59]/8 text-sm text-[#8fae87] mb-4">
            <CodeIcon c="w-4 h-4" />Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create your first <span className="gradient-text">rule set</span>
          </h2>
          <p className="text-[#6b9080] max-w-2xl mx-auto">
            Define spending limits and interaction permissions. See how AgentWill enforces boundaries automatically.
          </p>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="border-gradient overflow-hidden">
            <div className="flex border-b border-[#4a7c59]/10">
              {(['create', 'manage'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setDone(false) }}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                    tab === t ? 'bg-[#4a7c59]/10 text-[#8fae87] border-b-2 border-[#4a7c59]' : 'text-[#4a7c59]/40 hover:text-[#8fae87]'
                  }`}>
                  {t === 'create' ? 'Create Rules' : 'Manage Rules'}
                </button>
              ))}
            </div>
            <div className="p-8">
              {tab === 'create' ? (
                !done ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#8fae87]/70">Agent Address</label>
                      <input value={agentId} onChange={e => setAgentId(e.target.value)}
                        placeholder="0x... (agent's on-chain address)" className="w-full !py-4 !px-5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Spending Rules</h4>
                          <p className="text-xs text-[#4a7c59]/50 mt-1">Limits per token</p>
                        </div>
                        <button onClick={addRule} className="text-xs text-[#8fae87] hover:text-[#6b9080] flex items-center gap-1 transition-colors">
                          + Add Rule
                        </button>
                      </div>
                      <div className="space-y-3">
                        {rules.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 bg-[#4a7c59]/[0.03] rounded-xl p-4 border border-[#4a7c59]/10">
                            <select value={r.token} onChange={e => upd(i, 'token', e.target.value)} className="!w-24 !py-2 !px-2 !text-sm">
                              <option>USDC</option><option>ETH</option><option>DAI</option><option>wstETH</option>
                            </select>
                            <div className="flex-1">
                              <label className="text-xs text-[#4a7c59]/50">Daily Limit</label>
                              <input value={r.daily} onChange={e => upd(i, 'daily', e.target.value)} className="!py-1.5 !px-3 !text-sm" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-[#4a7c59]/50">Per-Tx Limit</label>
                              <input value={r.perTx} onChange={e => upd(i, 'perTx', e.target.value)} className="!py-1.5 !px-3 !text-sm" />
                            </div>
                            {rules.length > 1 && (
                              <button onClick={() => rm(i)} className="text-[#4a7c59]/30 hover:text-[#c97b7b] mt-5 transition-colors">
                                <XIcon c="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-[#4a7c59]/[0.03] rounded-xl border border-[#4a7c59]/10">
                      <div>
                        <h4 className="font-semibold text-sm">Reveal Metadata</h4>
                        <p className="text-xs text-[#4a7c59]/50 mt-1">Make activity publicly visible</p>
                      </div>
                      <button onClick={() => setReveal(!reveal)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${reveal ? 'bg-[#4a7c59]' : 'bg-[#4a7c59]/20'}`}>
                        <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${reveal ? 'left-7' : 'left-0.5'}`} />
                      </button>
                    </div>
                    <button onClick={handleDeploy} disabled={!agentId || !address || deploying}
                      className="btn-primary w-full !py-4 disabled:opacity-40">
                      <span className="flex items-center justify-center gap-2">
                        {deploying ? 'Deploying...' : address ? 'Deploy to Base Sepolia' : 'Connect Wallet First'} <ArrowRIcon c="w-5 h-5" />
                      </span>
                    </button>
                    {deployError && (
                      <p className="text-xs text-[#c97b7b] text-center">{deployError}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#4a7c59]/15 flex items-center justify-center animate-float">
                      <CheckIcon c="w-10 h-10 text-[#8fae87]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Rule Set Deployed!</h3>
                    <p className="text-[#6b9080] mb-6 max-w-md mx-auto">
                      Your rules are now on Base Sepolia. Your agent operates within these boundaries automatically.
                    </p>
                    <div className="code-block max-w-md mx-auto mb-6">
                      <div className="code-block-header"><span className="text-xs text-[#4a7c59] font-mono">basescan.io</span></div>
                      <div className="code-block-body py-4">
                        <div className="text-xs text-[#4a7c59]/50">Transaction</div>
                        {txHash ? (
                          <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-[#8fae87] font-mono mt-1 block hover:underline">
                            {txHash.slice(0, 10)}...{txHash.slice(-8)}
                          </a>
                        ) : (
                          <div className="text-sm text-[#8fae87] font-mono mt-1">Pending...</div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setDone(false)} className="btn-secondary">Deploy Another</button>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#8fae87]/70">Agent Address</label>
                    <div className="flex gap-3">
                      <input value={manageId} onChange={e => setManageId(e.target.value)}
                        placeholder="0x... (agent address)" className="flex-1 !py-4 !px-5" />
                      <button onClick={handleLoadRules} disabled={!manageId || loadingRules}
                        className="btn-secondary !py-4 !px-6 !text-sm">
                        {loadingRules ? 'Loading...' : 'Load Rules'}
                      </button>
                    </div>
                  </div>
                  {existingRules.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Active Rule Sets</h4>
                          <p className="text-xs text-[#4a7c59]/50 mt-1">View, edit, or revoke existing rules</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {existingRules.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 bg-[#4a7c59]/[0.03] rounded-xl p-4 border border-[#4a7c59]/10">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.isActive ? 'bg-[#8fae87]' : 'bg-[#6b9080]/30'}`} />
                            <div className="text-xs font-mono text-[#c9a84c] min-w-[80px]">
                              #{r.ruleSetId?.toString()}
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-[#4a7c59]/50">Rules</label>
                              <div className="text-sm text-[#8fae87] font-mono">
                                {r.spendingRules?.length || 0} spending, {r.interactionRules?.length || 0} interactions
                              </div>
                            </div>
                            <div className="text-xs text-[#6b9080]">
                              {r.isActive ? 'Active' : 'Revoked'}
                            </div>
                            <button className="text-xs text-[#c9a84c] hover:text-[#c97b7b] transition-colors mt-4">Edit</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-5 bg-[#c97b7b]/[0.05] rounded-xl border border-[#c97b7b]/15">
                    <div>
                      <h4 className="font-semibold text-sm text-[#c97b7b]">Danger Zone</h4>
                      <p className="text-xs text-[#6b9080]/60 mt-1">Permanently revoke all rules</p>
                    </div>
                    <button onClick={handleRevokeAll} disabled={!address || revoking}
                      className="btn-secondary !py-2 !px-4 !text-xs !border-[#c97b7b]/30 !text-[#c97b7b] hover:!bg-[#c97b7b]/10 disabled:opacity-40">
                      {revoking ? 'Revoking...' : 'Revoke All'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'What is AgentWill?', a: 'AgentWill is an on-chain rule engine that lets humans define enforceable boundaries for AI agents. Think of it as a legal will for your agent — it specifies exactly what the agent can spend, who it can interact with, and what it can reveal.' },
    { q: 'How does on-chain verification work?', a: 'Before every action, the agent calls the AgentWill smart contract to verify if the action is allowed. The contract checks spending limits, interaction rules, and privacy settings — then either allows or blocks the action, logging everything permanently on Base.' },
    { q: 'What chain does AgentWill run on?', a: 'AgentWill is built for Base (Ethereum L2). Base offers low fees, Coinbase backing, and inherits Ethereum security. Contracts can also be deployed to Base Sepolia for testing.' },
    { q: 'Is AgentWill compatible with ERC-8004?', a: 'Yes. AgentIdentity.sol implements the ERC-8004 agent identity standard, meaning agents registered with AgentWill get a portable, on-chain identity that works with any ERC-8004 compatible system.' },
    { q: 'Can I update rules after deployment?', a: 'Yes. The rule owner can update rule sets at any time — changing spending limits, adding or removing interaction targets, and adjusting privacy settings. All changes are logged on-chain.' },
    { q: 'What happens if an agent exceeds its limits?', a: 'The smart contract will reject the action and emit a rejection event. The agent cannot spend beyond its defined limits — the rules are enforced by the contract itself, not by the agent.' },
  ]
  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4a7c59]/5 to-transparent" />
      <div className="relative max-w-3xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-[#6b9080]">Everything you need to know about AgentWill.</p>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="glass rounded-xl overflow-hidden">
                <button className="w-full px-6 py-5 flex items-center justify-between text-left" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDownIcon c={`w-5 h-5 text-[#6b9080] transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-sm text-[#6b9080] leading-relaxed border-t border-[#4a7c59]/5 pt-4 animate-slide-up">
                    {faq.a}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="blob w-[300px] h-[300px] bg-[#4a7c59]/5 top-0 left-0" />
      <div className="relative max-w-md mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built by Shikhar Verma</h2>
          <p className="text-[#6b9080]">Student, builder, hackathon participant</p>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#4a7c59] to-[#2d5239] flex items-center justify-center">
              <UserIcon c="w-12 h-12 text-[#e8d5a3]" />
            </div>
            <h3 className="text-xl font-bold mb-1">Shikhar Verma</h3>
            <p className="text-[#6b9080] text-sm mb-4">@Shikhyyy</p>
            <p className="text-sm text-[#6b9080]/70 leading-relaxed mb-6">
              Building at the intersection of AI agents and on-chain infrastructure. Participating in The Synthesis Hackathon 2026.
            </p>
            <div className="flex justify-center gap-4">
              <a href="https://twitter.com/Shikhyyy" target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 text-sm">Follow on X</a>
              <a href="https://github.com/Shikhyy" target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 text-sm">GitHub</a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function TracksSection() {
  const tracks = [
    { name: 'Agents With Receipts — ERC-8004', org: 'Protocol Labs', prize: '$4,000' },
    { name: 'stETH Agent Treasury', org: 'Lido Labs', prize: '$3,000' },
    { name: 'Agent Services on Base', org: 'Coinbase', prize: '$5,000' },
    { name: 'Best Use of Delegations', org: 'MetaMask', prize: 'TBD' },
    { name: 'Synthesis Open Track', org: 'Community', prize: 'Funded' },
  ]
  return (
    <section className="relative py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4a7c59]/25 bg-[#4a7c59]/8 text-sm text-[#8fae87] mb-4">
            <StarIcon c="w-4 h-4" />The Synthesis Hackathon 2026
          </div>
          <h2 className="text-3xl font-bold">Submitted to 5 Tracks</h2>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((t, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="glass rounded-xl p-5 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm leading-tight pr-2">{t.name}</h4>
                  <span className="text-[#c9a84c] font-bold text-sm ml-2 flex-shrink-0">{t.prize}</span>
                </div>
                <p className="text-xs text-[#6b9080]/60">{t.org}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative border-t border-[#4a7c59]/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a7c59] to-[#2d5239] flex items-center justify-center">
              <ShieldIcon c="w-5 h-5 text-[#e8d5a3]" />
            </div>
            <div>
              <div className="font-bold">AgentWill</div>
              <div className="text-xs text-[#4a7c59]">On-chain rules for AI agents</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Shikhyy/AgentWill" target="_blank" rel="noopener noreferrer"
              className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors flex items-center gap-2">
              <GithubIcon c="w-5 h-5" /> GitHub
            </a>
            <a href="https://twitter.com/Shikhyyy" target="_blank" rel="noopener noreferrer"
              className="text-sm text-[#6b9080] hover:text-[#8fae87] transition-colors">@Shikhyyy</a>
            <span className="flex items-center gap-1.5 text-sm text-[#6b9080]">
              <BaseIcon c="w-4 h-4" /> Built on Base
            </span>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-[#4a7c59]/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4a7c59]/40">
          <span>© 2026 AgentWill. MIT License.</span>
          <span>The Synthesis Hackathon 2026</span>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <ComparisonSection />
      <HowItWorks />
      <StatsSection />
      <DemoSection />
      <FAQSection />
      <TeamSection />
      <TracksSection />
      <Footer />
    </main>
  )
}
