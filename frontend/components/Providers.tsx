'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  address: string | null
  chainId: string | null
  connecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  chainId: null,
  connecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
})

export function useWallet() {
  return useContext(WalletContext)
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts.length > 0) setAddress(accounts[0])
    })
    window.ethereum.request({ method: 'eth_chainId' }).then((id: string) => {
      setChainId(id)
    })

    const onAccounts = (accounts: string[]) => setAddress(accounts[0] || null)
    const onChain = (id: string) => setChainId(id)

    window.ethereum.on('accountsChanged', onAccounts)
    window.ethereum.on('chainChanged', onChain)
    return () => {
      window.ethereum!.removeListener('accountsChanged', onAccounts)
      window.ethereum!.removeListener('chainChanged', onChain)
    }
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      setError('No wallet detected. Please install MetaMask.')
      return
    }
    setConnecting(true)
    setError(null)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      setAddress(accounts[0])
      const id = await window.ethereum.request({ method: 'eth_chainId' }) as string
      setChainId(id)
    } catch (e: any) {
      setError(e.message || 'Failed to connect')
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
  }

  return (
    <WalletContext.Provider value={{ address, chainId, connecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}
