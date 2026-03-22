'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import Link from 'next/link'

// ─── Icons ───────────────────────────────────────────────────────────
function S(...a: [string, ...string[]]) { return { d: a[0], fill: a[1] !== 'none' ? a[1] : undefined } }

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
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
function ArrowRIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
}
function GithubIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
}
function MenuIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
}
function XIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function StarIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function ExtIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
function BaseIcon({ c = '' }: { c?: string }) {
  return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" fill="#0052FF" opacity="0.15"/><text x="12" y="16" textAnchor="middle" fill="#0052FF" fontSize="12" fontWeight="bold">b</text></svg>
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

// ─── Particles ───────────────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([])
  useEffect(() => {
    const arr = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 20 + 10,
      opacity: Math.random() * 0.4 + 0.05,
    }))
    setParticles(arr)
  }, [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          background: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#f59e0b' : '#22d3ee',
          opacity: p.opacity,
          animation: `float ${p.speed}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}
    </div>
  )
}

// ─── Animated Section ─────────────────────────────────────────────────
function FadeIn({ children, className = '', delay = 0, from = 'bottom' }: {
  children: ReactNode; className?: string; delay?: number; from?: 'bottom' | 'left' | 'right' | 'scale'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const transforms: Record<string, string> = {
    bottom: 'translateY(50px)', left: 'translateX(-50px)',
    right: 'translateX(50px)', scale: 'scale(0.9)',
  }
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`transition-all ${className}`} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0) scale(1)' : transforms[from],
      transitionDuration: '0.7s',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${delay}ms`,
    }}>{children}</div>
  )
}

// ─── Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = target / 60
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <div ref={ref}>{count}{suffix}</div>
}

// ─── Navbar ─────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn) }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all group-hover:scale-105">
            <ShieldIcon c="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AgentWill</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors">How it Works</a>
          <a href="#compare" className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors">Comparison</a>
          <a href="#faq" className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors">FAQ</a>
          <a href="https://github.com/Shikhyy/AgentWill" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400/60 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <GithubIcon c="w-4 h-4" /> GitHub
          </a>
          <a href="#demo" className="btn-primary text-sm !py-2.5 !px-5"><span>Launch App</span></a>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <XIcon c="w-6 h-6" /> : <MenuIcon c="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4 animate-slide-up">
          <a href="#features" className="text-emerald-300" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-emerald-300" onClick={() => setOpen(false)}>How it Works</a>
          <a href="#compare" className="text-emerald-300" onClick={() => setOpen(false)}>Comparison</a>
          <a href="#faq" className="text-emerald-300" onClick={() => setOpen(false)}>FAQ</a>
          <a href="#demo" className="btn-primary text-center" onClick={() => setOpen(false)}>Launch App</a>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid">
      <Particles />
      <div className="scan-line" />
      
      {/* Glow blobs */}
      <div className="blob w-[600px] h-[600px] bg-emerald-500/10 -top-48 -left-48" />
      <div className="blob w-[400px] h-[400px] bg-amber-500/8 top-1/3 -right-32" />
      <div className="blob w-[300px] h-[300px] bg-cyan-500/6 bottom-20 left-1/4" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-300 mb-8 animate-slide-up">
          <ZapIcon c="w-4 h-4 text-amber-400" />
          <span>Built for The Synthesis Hackathon 2026</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.02] animate-slide-up" style={{ animationDelay: '100ms' }}>
          On-Chain Rules
          <br />
          <span className="gradient-text">for AI Agents</span>
        </h1>

        <p className="text-lg md:text-xl text-emerald-400/60 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
          Define exactly what your AI agent can spend, who it can interact with, and what it can reveal.
          Every action verifiable on Base. You stay in control.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <a href="#demo" className="btn-primary text-lg group flex items-center gap-2">
            <span>Launch Dashboard</span>
            <ArrowRIcon c="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="https://github.com/Shikhyy/AgentWill" target="_blank" rel="noopener noreferrer" className="btn-secondary text-lg flex items-center gap-2">
            <GithubIcon c="w-5 h-5" />
            <span>View on GitHub</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
          {[
            { label: 'Chain', val: 'Base L2' }, { label: 'Tests', val: '8 Passing' },
            { label: 'Standard', val: 'ERC-8004' }, { label: 'Language', val: 'Solidity 0.8' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-emerald-400">{s.val}</div>
              <div className="text-xs text-emerald-400/40 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Animated code block */}
        <FadeIn delay={500} className="max-w-2xl mx-auto animate-slide-up">
          <div className="code-block animate-glow-pulse">
            <div className="code-block-header">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs text-emerald-400/40 ml-2 font-mono">agentwill.config.ts</span>
            </div>
            <div className="code-block-body text-left">
              <div><span className="text-emerald-500">const</span> <span className="text-amber-400">ruleSet</span> = {'{'}</div>
              <div className="pl-6"><span className="text-emerald-400">spending</span>: {'{'} <span className="text-cyan-300">dailyLimit</span>: <span className="text-amber-400">"$1,000"</span>, <span className="text-cyan-300">perTx</span>: <span className="text-amber-400">"$100"</span> {'}'},</div>
              <div className="pl-6"><span className="text-emerald-400">interactions</span>: [<span className="text-amber-400">"UniswapRouter"</span>, <span className="text-amber-400">"Aerodrome"</span>],</div>
              <div className="pl-6"><span className="text-emerald-400">privacy</span>: <span className="text-amber-400">"strict"</span></div>
              <div>{'}'}</div>
              <div className="mt-2 text-emerald-500">await</div>
              <div className="pl-6"><span className="text-amber-400">agentWill</span>.<span className="text-cyan-300">deploy</span>(ruleSet)</div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-emerald-400/50 text-xs">Rule set deployed on Base</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border border-emerald-500/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-emerald-400/60 animate-pulse" />
        </div>
      </div>
    </section>
  )
}

// ─── Problem Section ─────────────────────────────────────────────────
function ProblemSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent" />
      <div className="blob w-[400px] h-[400px] bg-amber-500/8 -top-32 right-0" />
      
      <div className="relative max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/10 text-sm text-amber-300 mb-6">
            <AlertIcon c="w-4 h-4" />
            The Problem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Agents have <span className="gradient-text-amber">blank cheque</span> access
          </h2>
          <p className="text-emerald-400/50 max-w-2xl mx-auto text-lg">
            When you give an agent access to your wallet, there is nothing enforcing what it can and can't do.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <WalletIcon c="w-8 h-8" />, title: 'No Spending Limits', desc: 'Your agent can drain your entire wallet. No per-transaction caps, no daily limits, no boundaries.', color: 'amber' },
            { icon: <GlobeIcon c="w-8 h-8" />, title: 'No Interaction Controls', desc: 'Agents call any contract, any function. You have no way to whitelist or blacklist specific protocols.', color: 'rose' },
            { icon: <LockIcon c="w-8 h-8" />, title: 'No Privacy', desc: 'Every API call leaks your spending patterns, contacts, and behavior. You never consented to that exposure.', color: 'cyan' },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="border-gradient p-8 h-full card-hover">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  item.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  item.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-emerald-400/50 leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400} className="mt-16">
          <div className="border-gradient p-8 md:p-12 text-center">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-emerald-400/80">
              Humans are either forced to <span className="text-amber-400 font-bold">babysit their agents constantly</span>,
              or hand over control entirely and <span className="text-rose-400 font-bold">hope for the best</span>.
            </p>
            <p className="text-lg mt-4 text-emerald-400/50">
              Neither is acceptable as agents become more capable and more autonomous.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Features Section ────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: <WalletIcon c="w-6 h-6" />, title: 'Spending Controls', desc: 'Per-token daily limits and per-transaction caps. Agent spends freely within your boundaries.', color: 'emerald', badge: 'NEW' },
    { icon: <GlobeIcon c="w-6 h-6" />, title: 'Interaction Rules', desc: 'Whitelist or blacklist contracts and function selectors. Full scope control over agent behavior.', color: 'amber', badge: '' },
    { icon: <LockIcon c="w-6 h-6" />, title: 'Privacy Controls', desc: 'Choose what metadata your agent reveals on-chain. Keep patterns and behavior private.', color: 'cyan', badge: '' },
    { icon: <ShieldIcon c="w-6 h-6" />, title: 'On-Chain Verification', desc: 'Every action verified against smart contract before execution. All logs immutable on Base.', color: 'rose', badge: '' },
    { icon: <BotIcon c="w-6 h-6" />, title: 'ERC-8004 Identity', desc: 'On-chain agent identity built for the ERC-8004 standard. Real identity, portable everywhere.', color: 'violet', badge: 'ERC-8004' },
    { icon: <ActivityIcon c="w-6 h-6" />, title: 'Activity Dashboard', desc: 'Real-time monitoring of every agent action. See what was allowed, blocked, and why.', color: 'blue', badge: '' },
  ]
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="blob w-[500px] h-[500px] bg-emerald-500/8 -top-48 -right-48" />
      <div className="blob w-[300px] h-[300px] bg-amber-500/5 -bottom-32 left-0" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-300 mb-4">
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything an agent needs to stay <span className="gradient-text">accountable</span>
          </h2>
          <p className="text-emerald-400/50 max-w-2xl mx-auto text-lg">
            AgentWill is the single infrastructure layer that addresses spending, interaction, privacy, and accountability — all at once.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="glass rounded-2xl p-6 h-full card-hover group relative overflow-hidden">
                {f.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {f.badge}
                    </span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${colorMap[f.color]}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                <p className="text-sm text-emerald-400/50 leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Comparison ───────────────────────────────────────────────────────
function ComparisonSection() {
  return (
    <section id="compare" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-5xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-300 mb-4">
            Before vs After
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Before AgentWill <span className="text-rose-400">vs</span> After AgentWill
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn delay={0} from="left">
            <div className="border border-rose-500/20 rounded-2xl p-8 bg-rose-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-transparent" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <XIcon c="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="font-bold text-rose-400">Without AgentWill</div>
                  <div className="text-xs text-rose-400/50">The old way</div>
                </div>
              </div>
              <div className="space-y-4">
                {['Agent has unlimited wallet access', 'No spending controls or limits', 'Any contract can be called', 'All activity leaks metadata', 'No way to verify agent behavior', 'Human must babysit constantly'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XIcon c="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-rose-400/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={150} from="right">
            <div className="border border-emerald-500/20 rounded-2xl p-8 bg-emerald-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckIcon c="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-emerald-400">With AgentWill</div>
                  <div className="text-xs text-emerald-400/50">The right way</div>
                </div>
              </div>
              <div className="space-y-4">
                {['Agent operates within defined rules', 'Per-token daily & per-tx limits', 'Only whitelisted contracts callable', 'Configurable privacy controls', 'Every action logged on-chain', 'Human stays in control, passively'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckIcon c="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-emerald-400/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Define Your Rules', desc: 'Set spending limits, interaction permissions, and privacy controls through a clean interface. No code required.' },
    { n: '02', title: 'Deploy On-Chain', desc: 'Rules compile to an immutable smart contract on Base. Survives any platform, any provider.' },
    { n: '03', title: 'Agent Operates', desc: 'Agent queries the contract before each action. Contract allows or blocks — permanently logged.' },
    { n: '04', title: 'You Stay in Control', desc: 'Monitor activity in real-time. Update rules anytime. Revoke access instantly if needed.' },
  ]
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="blob w-[400px] h-[400px] bg-emerald-500/6 top-0 left-1/2 -translate-x-1/2" />
      <div className="relative max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-300 mb-4">
            How it Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple by design
          </h2>
          <p className="text-emerald-400/50 max-w-2xl mx-auto text-lg">
            From rule definition to on-chain enforcement in minutes.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="glass rounded-2xl p-6 h-full card-hover relative">
                <div className="text-6xl font-black text-emerald-500/10 mb-4">{s.n}</div>
                <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                <p className="text-sm text-emerald-400/50 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRIcon c="w-5 h-5 text-emerald-500/20" />
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

// ─── Stats ───────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { label: 'Testnet Ready', val: 'Base', suffix: ' Sepolia' },
    { label: 'Tests Passing', val: '8', suffix: '/8' },
    { label: 'Contracts', val: '2', suffix: '' },
    { label: 'Agent Standard', val: 'ERC', suffix: '-8004' },
  ]
  return (
    <section className="relative py-20">
      <div className="border-y border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 80} className="text-center">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                  <Counter target={parseInt(s.val)} suffix={s.suffix} />
                </div>
                <div className="text-sm text-emerald-400/40 uppercase tracking-widest">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Demo Section ────────────────────────────────────────────────────
function DemoSection() {
  const [tab, setTab] = useState<'create' | 'manage'>('create')
  const [agentId, setAgentId] = useState('')
  const [spendingRules, setSpendingRules] = useState([{ token: 'USDC', daily: '1000', perTx: '100' }])
  const [reveal, setReveal] = useState(false)
  const [done, setDone] = useState(false)

  const addRule = () => setSpendingRules([...spendingRules, { token: 'ETH', daily: '0.5', perTx: '0.1' }])
  const update = (i: number, f: string, v: string) => {
    const u = [...spendingRules]; u[i] = { ...u[i], [f]: v }; setSpendingRules(u)
  }
  const remove = (i: number) => setSpendingRules(spendingRules.filter((_, j) => j !== i))

  return (
    <section id="demo" className="relative py-32 overflow-hidden">
      <div className="blob w-[600px] h-[600px] bg-emerald-500/6 -top-48 left-1/2 -translate-x-1/2" />
      <div className="relative max-w-4xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-300 mb-4">
            <CodeIcon c="w-4 h-4" />
            Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create your first <span className="gradient-text">rule set</span>
          </h2>
          <p className="text-emerald-400/50 max-w-2xl mx-auto">
            Define spending limits and interaction permissions. See how AgentWill enforces boundaries automatically.
          </p>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="border-gradient overflow-hidden">
            <div className="flex border-b border-emerald-500/10">
              {(['create', 'manage'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setDone(false) }}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                    tab === t ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-emerald-400/40 hover:text-emerald-300'
                  }`}>
                  {t === 'create' ? 'Create Rules' : 'Manage Rules'}
                </button>
              ))}
            </div>
            <div className="p-8">
              {!done ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-emerald-400/70">Agent Address</label>
                    <input value={agentId} onChange={e => setAgentId(e.target.value)}
                      placeholder="0x... (agent's on-chain address)"
                      className="w-full !py-4 !px-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Spending Rules</h4>
                        <p className="text-xs text-emerald-400/40 mt-1">Limits per token</p>
                      </div>
                      <button onClick={addRule} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        + Add Rule
                      </button>
                    </div>
                    <div className="space-y-3">
                      {spendingRules.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 bg-emerald-500/[0.03] rounded-xl p-4 border border-emerald-500/10">
                          <select value={r.token} onChange={e => update(i, 'token', e.target.value)} className="!w-24 !py-2 !px-2 !text-sm">
                            <option>USDC</option><option>ETH</option><option>DAI</option><option>wstETH</option>
                          </select>
                          <div className="flex-1">
                            <label className="text-xs text-emerald-400/40">Daily Limit</label>
                            <input value={r.daily} onChange={e => update(i, 'daily', e.target.value)} className="!py-1.5 !px-3 !text-sm" />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-emerald-400/40">Per-Tx Limit</label>
                            <input value={r.perTx} onChange={e => update(i, 'perTx', e.target.value)} className="!py-1.5 !px-3 !text-sm" />
                          </div>
                          {spendingRules.length > 1 && (
                            <button onClick={() => remove(i)} className="text-emerald-400/30 hover:text-rose-400 mt-5">
                              <XIcon c="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-emerald-500/[0.03] rounded-xl border border-emerald-500/10">
                    <div>
                      <h4 className="font-semibold text-sm">Reveal Metadata</h4>
                      <p className="text-xs text-emerald-400/40 mt-1">Make activity publicly visible</p>
                    </div>
                    <button onClick={() => setReveal(!reveal)}
                      className={`w-14 h-7 rounded-full transition-colors relative ${reveal ? 'bg-emerald-500' : 'bg-emerald-500/20'}`}>
                      <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${reveal ? 'left-7' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <button onClick={() => setDone(true)} disabled={!agentId}
                    className="btn-primary w-full !py-4 disabled:opacity-40">
                    <span className="flex items-center justify-center gap-2">
                      Deploy to Base Sepolia
                      <ArrowRIcon c="w-5 h-5" />
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-float">
                    <CheckIcon c="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Rule Set Deployed!</h3>
                  <p className="text-emerald-400/50 mb-6 max-w-md mx-auto">
                    Your rules are now on Base Sepolia. Your agent operates within these boundaries automatically.
                  </p>
                  <div className="code-block max-w-md mx-auto mb-6">
                    <div className="code-block-header"><span className="text-xs text-emerald-400/40 font-mono">basescan.io</span></div>
                    <div className="code-block-body py-4">
                      <div className="text-xs text-emerald-400/50">Transaction</div>
                      <div className="text-sm text-emerald-400 font-mono mt-1">0x7f3a...8c2d</div>
                    </div>
                  </div>
                  <button onClick={() => setDone(false)} className="btn-secondary">Deploy Another</button>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'What is AgentWill?', a: 'AgentWill is an on-chain rule engine that lets humans define enforceable boundaries for AI agents. Think of it as a legal will for your agent — it specifies exactly what the agent can spend, who it can interact with, and what it can reveal.' },
    { q: 'How does on-chain verification work?', a: 'Before every action, the agent calls the AgentWill smart contract to verify if the action is allowed. The contract checks spending limits, interaction rules, and privacy settings — then either allows or blocks the action, logging everything permanently on Base.' },
    { q: 'What chain does AgentWill run on?', a: 'AgentWill is built for Base (Ethereum L2). Base offers low fees (fractions of a cent), Coinbase backing, and inherits Ethereum security. Contracts can also be deployed to Base Sepolia for testing.' },
    { q: 'Is AgentWill compatible with ERC-8004?', a: 'Yes. AgentIdentity.sol implements the ERC-8004 agent identity standard, meaning agents registered with AgentWill get a portable, on-chain identity that works with any ERC-8004 compatible system.' },
    { q: 'Can I update rules after deployment?', a: 'Yes. The rule owner can update rule sets at any time — changing spending limits, adding or removing interaction targets, and adjusting privacy settings. All changes are logged on-chain.' },
    { q: 'What happens if an agent exceeds its limits?', a: 'The smart contract will reject the action and emit a rejection event. The agent cannot spend beyond its defined limits — the rules are enforced by the contract itself, not by the agent.' },
  ]
  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-3xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-emerald-400/50">Everything you need to know about AgentWill.</p>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="glass rounded-xl overflow-hidden">
                <button className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDownIcon c={`w-5 h-5 text-emerald-400/50 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-sm text-emerald-400/60 leading-relaxed border-t border-emerald-500/5 pt-4 animate-slide-up">
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

// ─── Team ────────────────────────────────────────────────────────────
function TeamSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="blob w-[300px] h-[300px] bg-emerald-500/6 top-0 left-0" />
      <div className="relative max-w-5xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built by Shikhar Verma</h2>
          <p className="text-emerald-400/50">Student, builder, hackathon participant</p>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="flex justify-center">
            <div className="glass rounded-2xl p-8 text-center max-w-md w-full">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <UserIcon c="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Shikhar Verma</h3>
              <p className="text-emerald-400/50 text-sm mb-4">@Shikhyyy</p>
              <p className="text-sm text-emerald-400/60 leading-relaxed mb-6">
                Building at the intersection of AI agents and on-chain infrastructure. Participating in The Synthesis Hackathon 2026.
              </p>
              <div className="flex justify-center gap-4">
                <a href="https://twitter.com/Shikhyyy" target="_blank" rel="noopener noreferrer"
                  className="btn-secondary !py-2 !px-4 text-sm">
                  Follow on X
                </a>
                <a href="https://github.com/Shikhyy" target="_blank" rel="noopener noreferrer"
                  className="btn-secondary !py-2 !px-4 text-sm">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Tracks ──────────────────────────────────────────────────────────
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-300 mb-4">
            <StarIcon c="w-4 h-4" />
            The Synthesis Hackathon 2026
          </div>
          <h2 className="text-3xl font-bold">Submitted to 5 Tracks</h2>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((t, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="glass rounded-xl p-5 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm leading-tight">{t.name}</h4>
                  <span className="text-emerald-400 font-bold text-sm ml-2 flex-shrink-0">{t.prize}</span>
                </div>
                <p className="text-xs text-emerald-400/40">{t.org}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t border-emerald-500/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <ShieldIcon c="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold">AgentWill</div>
              <div className="text-xs text-emerald-400/40">On-chain rules for AI agents</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Shikhyy/AgentWill" target="_blank" rel="noopener noreferrer"
              className="text-sm text-emerald-400/50 hover:text-emerald-400 transition-colors flex items-center gap-2">
              <GithubIcon c="w-5 h-5" /> GitHub
            </a>
            <a href="https://twitter.com/Shikhyyy" target="_blank" rel="noopener noreferrer"
              className="text-sm text-emerald-400/50 hover:text-emerald-400 transition-colors">@Shikhyyy</a>
            <span className="flex items-center gap-1.5 text-sm text-emerald-400/50">
              <BaseIcon c="w-4 h-4" /> Built on Base
            </span>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-400/30">
          <span>© 2026 AgentWill. MIT License.</span>
          <span>The Synthesis Hackathon 2026</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────
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
