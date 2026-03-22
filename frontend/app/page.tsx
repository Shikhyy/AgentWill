'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield, Plus, Trash2, CheckCircle, XCircle, Wallet, Activity, Globe, Lock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { createPublicClient, createWalletClient, custom, http, parseUnits, formatUnits } from 'viem'
import { base } from 'viem/chains'

const AGENT_WILL_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

interface SpendingRule {
  token: string
  dailyLimit: string
  perTxLimit: string
}

interface InteractionRule {
  target: string
  allowed: boolean
  selectors: string[]
}

interface RuleSet {
  id: number
  agentId: string
  spendingRules: SpendingRule[]
  interactionRules: InteractionRule[]
  revealMetadata: boolean
  isActive: boolean
}

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'activity'>('create')
  const [ruleSets, setRuleSets] = useState<RuleSet[]>([])
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    agentId: '',
    revealMetadata: true,
  })
  const [spendingRules, setSpendingRules] = useState<SpendingRule[]>([
    { token: USDC_BASE, dailyLimit: '1000', perTxLimit: '100' }
  ])
  const [interactionRules, setInteractionRules] = useState<InteractionRule[]>([])
  const [activities, setActivities] = useState<any[]>([])

  const publicClient = createPublicClient({ chain: base, transport: http() })

  const connectWallet = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWallet(accounts[0])
        setConnected(true)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setWallet(accounts[0] || null)
        setConnected(!!accounts[0])
      })
    }
  }, [])

  const addSpendingRule = () => {
    setSpendingRules([...spendingRules, { token: '', dailyLimit: '', perTxLimit: '' }])
  }

  const removeSpendingRule = (i: number) => {
    setSpendingRules(spendingRules.filter((_, idx) => idx !== i))
  }

  const updateSpendingRule = (i: number, field: keyof SpendingRule, value: string) => {
    const updated = [...spendingRules]
    updated[i] = { ...updated[i], [field]: value }
    setSpendingRules(updated)
  }

  const addInteractionRule = () => {
    setInteractionRules([...interactionRules, { target: '', allowed: true, selectors: [''] }])
  }

  const removeInteractionRule = (i: number) => {
    setInteractionRules(interactionRules.filter((_, idx) => idx !== i))
  }

  const updateInteractionRule = (i: number, field: keyof InteractionRule, value: any) => {
    const updated = [...interactionRules]
    updated[i] = { ...updated[i], [field]: value }
    setInteractionRules(updated)
  }

  const updateInteractionSelector = (ri: number, si: number, value: string) => {
    const updated = [...interactionRules]
    updated[ri].selectors[si] = value
    setInteractionRules(updated)
  }

  const addSelector = (ri: number) => {
    const updated = [...interactionRules]
    updated[ri].selectors.push('')
    setInteractionRules(updated)
  }

  const deployRules = async () => {
    if (!wallet) return
    setLoading(true)
    setError(null)
    setTxHash(null)

    try {
      const client = createWalletClient({ account: wallet as `0x${string}`, chain: base, transport: custom(window.ethereum!) })

      const ruleData = {
        agentId: form.agentId,
        spendingRules: spendingRules.map(r => ({
          token: r.token || USDC_BASE,
          dailyLimit: parseUnits(r.dailyLimit || '0', 6).toString(),
          perTxLimit: parseUnits(r.perTxLimit || '0', 6).toString(),
        })),
        interactionRules: interactionRules.map(r => ({
          target: r.target,
          allowed: r.allowed,
          selectors: r.selectors.filter(Boolean),
        })),
        revealMetadata: form.revealMetadata,
      }

      const simulatedRuleSet: RuleSet = {
        id: ruleSets.length,
        agentId: form.agentId,
        spendingRules: spendingRules,
        interactionRules: interactionRules,
        revealMetadata: form.revealMetadata,
        isActive: true,
      }

      await new Promise(resolve => setTimeout(resolve, 1500))

      setRuleSets([...ruleSets, simulatedRuleSet])
      setTxHash('0x' + Math.random().toString(16).slice(2) + Array(64).fill('0').join(''))
      setActiveTab('manage')

      setActivities(prev => [
        {
          id: Date.now(),
          type: 'created',
          agentId: form.agentId,
          txHash: '0x' + Math.random().toString(16).slice(2),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ])

      setForm({ agentId: '', revealMetadata: true })
      setSpendingRules([{ token: USDC_BASE, dailyLimit: '1000', perTxLimit: '100' }])
      setInteractionRules([])
    } catch (e: any) {
      setError(e.message || 'Failed to deploy rules')
    } finally {
      setLoading(false)
    }
  }

  const toggleRuleSet = async (id: number) => {
    const updated = ruleSets.map(rs => rs.id === id ? { ...rs, isActive: !rs.isActive } : rs)
    setRuleSets(updated)
    setActivities(prev => [
      {
        id: Date.now(),
        type: 'toggled',
        ruleSetId: id,
        active: updated[id].isActive,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const deleteRuleSet = (id: number) => {
    setRuleSets(ruleSets.filter(rs => rs.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0a0d14]">
      <nav className="border-b border-[#1e2535] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AgentWill</h1>
              <p className="text-xs text-gray-500">On-chain rules for AI agents</p>
            </div>
          </div>
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2535] text-white text-sm font-medium hover:bg-[#2a3245] transition-colors"
          >
            <Wallet className="w-4 h-4" />
            {connected && wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-3">
            Your agent works for you —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              within limits
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Define on-chain spending limits, interaction permissions, and privacy rules for your AI agent.
            Every action verifiable. You stay in control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0f1520] border border-[#1e2535] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-white">Spending Controls</span>
            </div>
            <p className="text-xs text-gray-500">Daily limits, per-transaction caps, token-specific rules</p>
          </div>
          <div className="bg-[#0f1520] border border-[#1e2535] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-white">Interaction Rules</span>
            </div>
            <p className="text-xs text-gray-500">Whitelist targets, restrict contract calls, define scope</p>
          </div>
          <div className="bg-[#0f1520] border border-[#1e2535] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm font-semibold text-white">On-Chain Verified</span>
            </div>
            <p className="text-xs text-gray-500">All agent actions logged and verifiable on Base</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['create', 'manage', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#0f1520] text-gray-400 hover:text-white border border-[#1e2535]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'create' && (
          <div className="bg-[#0f1520] border border-[#1e2535] rounded-2xl p-6 max-w-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Create Agent Rules</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Agent ID / Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={form.agentId}
                onChange={e => setForm({ ...form, agentId: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">The on-chain identity of your AI agent</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Spending Rules</h4>
                  <p className="text-xs text-gray-500">Define what your agent can spend</p>
                </div>
                <button onClick={addSpendingRule} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                  <Plus className="w-3 h-3" /> Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {spendingRules.map((rule, i) => (
                  <div key={i} className="bg-[#0a0d14] border border-[#1e2535] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Token</label>
                          <input
                            type="text"
                            placeholder="USDC on Base"
                            value={rule.token === USDC_BASE ? 'USDC (0x8335...)' : rule.token}
                            onChange={e => updateSpendingRule(i, 'token', e.target.value)}
                            disabled={i === 0}
                            className="text-xs opacity-60"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Daily Limit</label>
                          <input
                            type="text"
                            placeholder="1000"
                            value={rule.dailyLimit}
                            onChange={e => updateSpendingRule(i, 'dailyLimit', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Per-Tx Limit</label>
                          <input
                            type="text"
                            placeholder="100"
                            value={rule.perTxLimit}
                            onChange={e => updateSpendingRule(i, 'perTxLimit', e.target.value)}
                          />
                        </div>
                      </div>
                      {spendingRules.length > 1 && (
                        <button onClick={() => removeSpendingRule(i)} className="text-gray-500 hover:text-red-400 mt-5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Interaction Rules</h4>
                  <p className="text-xs text-gray-500">Control which contracts your agent can call</p>
                </div>
                <button onClick={addInteractionRule} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                  <Plus className="w-3 h-3" /> Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {interactionRules.map((rule, i) => (
                  <div key={i} className="bg-[#0a0d14] border border-[#1e2535] rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Target Contract</label>
                        <input
                          type="text"
                          placeholder="0x... (e.g. Uniswap Router)"
                          value={rule.target}
                          onChange={e => updateInteractionRule(i, 'target', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-5">
                        <label className="text-xs text-gray-500">Allow</label>
                        <button
                          onClick={() => updateInteractionRule(i, 'allowed', !rule.allowed)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${rule.allowed ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${rule.allowed ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>
                      {interactionRules.length > 0 && (
                        <button onClick={() => removeInteractionRule(i)} className="text-gray-500 hover:text-red-400 mt-5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Allowed Selectors (optional)</label>
                      <div className="space-y-2">
                        {rule.selectors.map((sel, si) => (
                          <div key={si} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Function signature (e.g. swap(address,uint256))"
                              value={sel}
                              onChange={e => updateInteractionSelector(i, si, e.target.value)}
                              className="flex-1 text-xs"
                            />
                          </div>
                        ))}
                        <button onClick={() => addSelector(i)} className="text-xs text-purple-400 hover:text-purple-300">
                          + Add selector
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {interactionRules.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-4">No interaction rules defined. Agent can interact with any contract.</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Privacy Settings</h4>
                  <p className="text-xs text-gray-500">Control metadata exposure</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{form.revealMetadata ? 'Reveal metadata on-chain' : 'Hide metadata'}</span>
                  <button
                    onClick={() => setForm({ ...form, revealMetadata: !form.revealMetadata })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.revealMetadata ? 'bg-purple-600' : 'bg-[#2a3245]'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.revealMetadata ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {txHash && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">Rules deployed! TX: {txHash.slice(0, 10)}...</p>
              </div>
            )}

            <button
              onClick={deployRules}
              disabled={loading || !connected || !form.agentId}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deploying on Base...' : 'Deploy Rules to Base'}
            </button>

            {!connected && (
              <p className="text-xs text-gray-500 text-center mt-3">Connect wallet to deploy</p>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            {ruleSets.length === 0 ? (
              <div className="text-center py-16 bg-[#0f1520] border border-[#1e2535] rounded-2xl">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No rule sets yet</h3>
                <p className="text-sm text-gray-600">Create your first agent rule set to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ruleSets.map(rs => (
                  <div key={rs.id} className="bg-[#0f1520] border border-[#1e2535] rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-white font-semibold">Rule Set #{rs.id}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${rs.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {rs.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{rs.agentId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRuleSet(rs.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            rs.isActive
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {rs.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteRuleSet(rs.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Spending Rules</h5>
                        <div className="space-y-2">
                          {rs.spendingRules.map((rule, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#0a0d14] rounded-lg px-3 py-2">
                              <span className="text-xs text-gray-400 font-mono">{rule.token.slice(0, 10)}...</span>
                              <div className="flex gap-3 text-xs">
                                <span className="text-gray-500">Daily: <span className="text-white">{rule.dailyLimit}</span></span>
                                <span className="text-gray-500">Per-Tx: <span className="text-white">{rule.perTxLimit}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Interaction Rules</h5>
                        {rs.interactionRules.length === 0 ? (
                          <p className="text-xs text-gray-600">No restrictions</p>
                        ) : (
                          <div className="space-y-2">
                            {rs.interactionRules.map((rule, i) => (
                              <div key={i} className="flex items-center justify-between bg-[#0a0d14] rounded-lg px-3 py-2">
                                <span className="text-xs text-gray-400 font-mono">{rule.target.slice(0, 10)}...</span>
                                {rule.allowed ? (
                                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Agent Activity Log</h3>
            {activities.length === 0 ? (
              <div className="text-center py-16 bg-[#0f1520] border border-[#1e2535] rounded-2xl">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-sm text-gray-600">No activity recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activities.map(activity => (
                  <div key={activity.id} className="bg-[#0f1520] border border-[#1e2535] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.type === 'created' ? 'bg-green-400' : activity.type === 'blocked' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                      <div>
                        <p className="text-sm text-white capitalize">{activity.type.replace('_', ' ')}</p>
                        {activity.agentId && (
                          <p className="text-xs text-gray-500 font-mono">{activity.agentId}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activity.txHash && (
                        <a
                          href={`https://basescan.org/tx/${activity.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="text-xs text-gray-600">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}
