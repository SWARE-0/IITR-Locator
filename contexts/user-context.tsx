"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ethers } from "ethers"
import { connectWallet, getTokens, getCompletedPuzzles } from "@/lib/web3"

interface UserContextType {
  tokens: number
  completedPuzzles: number[]
  walletAddress: string | null
  setWalletAddress: (address: string | null) => void
  contract: ethers.Contract | null
  connectWallet: () => Promise<void>
  updateUserData: () => Promise<void>
  username: string
  isContractInitialized: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState(0)
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([])
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [username, setUsername] = useState<string>("")
  const [isContractInitialized, setIsContractInitialized] = useState(false)

  const connectUserWallet = async () => {
    try {
      const { address, contract } = await connectWallet()
      setWalletAddress(address)
      setContract(contract)
      setIsContractInitialized(true)
      await updateUserData(address, contract)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setIsContractInitialized(false)
    }
  }

  const updateUserData = async (address?: string, contractInstance?: ethers.Contract) => {
    if (!address) address = walletAddress
    if (!contractInstance) contractInstance = contract
    if (!address || !contractInstance) return

    try {
      const userTokens = await getTokens(contractInstance, address)
      const userCompletedPuzzles = await getCompletedPuzzles(contractInstance, address)
      setTokens(userTokens)
      setCompletedPuzzles(userCompletedPuzzles)
      setUsername(address) // Set full wallet address as username
    } catch (error) {
      console.error("Failed to update user data:", error)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          connectUserWallet() // Reconnect wallet when account changes
        } else {
          setWalletAddress(null)
          setTokens(0)
          setCompletedPuzzles([])
          setUsername("")
          setIsContractInitialized(false)
        }
      })
    }
  }, [connectUserWallet]) // Added connectUserWallet to dependencies

  return (
    <UserContext.Provider
      value={{
        tokens,
        completedPuzzles,
        walletAddress,
        setWalletAddress,
        contract,
        connectWallet: connectUserWallet,
        updateUserData: () => updateUserData(),
        username,
        isContractInitialized,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

