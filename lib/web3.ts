import { ethers } from "ethers"
import IITRLocatorGameABI from "./IITRLocatorGameABI.json"

const contractAddress = "0x0000000000000000000000000000000000000000" // Replace with your actual deployed contract address

export async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const contract = new ethers.Contract(contractAddress, IITRLocatorGameABI, signer)
      return { address, signer, contract }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  } else {
    throw new Error("Please install MetaMask")
  }
}

export async function solvePuzzle(contract: ethers.Contract, puzzleId: number) {
  try {
    const tx = await contract.solvePuzzle(puzzleId)
    await tx.wait()
    console.log(`Puzzle ${puzzleId} solved successfully`)
    return true
  } catch (error) {
    console.error("Failed to solve puzzle:", error)
    return false
  }
}

export async function getCompletedPuzzles(contract: ethers.Contract, address: string) {
  try {
    return await contract.getCompletedPuzzles(address)
  } catch (error) {
    console.error("Failed to get completed puzzles:", error)
    return []
  }
}

export async function getTokens(contract: ethers.Contract, address: string) {
  try {
    return await contract.getTokens(address)
  } catch (error) {
    console.error("Failed to get tokens:", error)
    return 0
  }
}

export async function getLeaderboard(contract: ethers.Contract) {
  try {
    const [addresses, scores] = await contract.getLeaderboard()
    return addresses.map((address: string, index: number) => ({
      address,
      score: scores[index].toNumber(),
    }))
  } catch (error) {
    console.error("Failed to get leaderboard:", error)
    return []
  }
}

export async function getPuzzle(contract: ethers.Contract, puzzleId: number) {
  try {
    const [location, imageHash] = await contract.getPuzzle(puzzleId)
    return { location, imageHash }
  } catch (error) {
    console.error("Failed to get puzzle:", error)
    return null
  }
}

