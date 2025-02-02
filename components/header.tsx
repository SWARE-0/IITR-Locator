"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Trophy, LogOut, User, Copy, Check, Coins, Wallet, Crown, Medal, Award } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { toast } from "sonner"

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
  return <span className="text-lg font-bold text-white/70 w-6 text-center">{rank}</span>
}

export default function Header() {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { username, tokens, walletAddress, setWalletAddress } = useUser()

  const isPostWalletConnection = !pathname.includes("/connect-wallet") && pathname !== "/"

  const handleLogout = async () => {
    try {
      // Implement Ethereum logout logic here if needed
      setWalletAddress(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Address copied to clipboard!")
    }
  }

  // Mock leaderboard data
  const leaderboardData = Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    username: `User${i + 1}`,
    tokens: Math.floor(Math.random() * 1000),
    change: Math.random() > 0.5 ? 1 : -1,
  }))

  return (
    <header className="fixed top-0 right-0 z-50 p-4 flex gap-4">
      {isPostWalletConnection && (
        <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowLeaderboard(true)}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 overflow-hidden group relative"
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                  backgroundImage:
                    "linear-gradient(45deg, transparent 0%, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%, transparent 100%)",
                }}
              />
              <motion.div whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                <Trophy className="mr-2 h-4 w-4" />
              </motion.div>
              Leaderboard
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 overflow-hidden group relative">
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                      backgroundImage:
                        "linear-gradient(45deg, transparent 0%, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%, transparent 100%)",
                    }}
                  />
                  <motion.div whileHover={{ scale: [1, 1.2, 0.9, 1.1, 1] }} transition={{ duration: 0.5 }}>
                    <User className="mr-2 h-4 w-4" />
                  </motion.div>
                  You
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-navy-800/95 text-white backdrop-blur-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg font-orbitron">{username || "Guest"}</p>
                      <p className="text-sm text-gray-400">Player</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Tokens</p>
                      <p className="font-bold">{tokens || 0}</p>
                    </div>
                  </div>

                  {walletAddress && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Wallet address</p>
                          <p className="font-medium text-sm truncate">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(
                            -4,
                          )}`}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyAddress}
                        className="w-full mt-2 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
                      >
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Address"}
                      </Button>
                    </div>
                  )}

                  <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </>
      )}

      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-xl border-none text-white">
          <div className="relative overflow-hidden rounded-lg p-6">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-transparent" />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
            />

            <div className="relative">
              <div className="text-center mb-6">
                <motion.h2
                  className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  Global Leaderboard
                </motion.h2>
              </div>

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {leaderboardData.map((user) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group relative"
                    >
                      {/* Glow effect */}
                      <div
                        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                          user.rank <= 3
                            ? "bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 blur"
                            : ""
                        }`}
                      />

                      <motion.div
                        className={`relative flex items-center justify-between p-4 rounded-lg backdrop-blur-sm
                          ${
                            user.rank === 1
                              ? "bg-gradient-to-r from-yellow-500/30 to-amber-500/30"
                              : user.rank === 2
                                ? "bg-gradient-to-r from-gray-400/30 to-gray-500/30"
                                : user.rank === 3
                                  ? "bg-gradient-to-r from-amber-700/30 to-amber-800/30"
                                  : "bg-white/5"
                          }
                          hover:bg-white/10 transition-colors duration-300`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-4">
                          <RankIcon rank={user.rank} />
                          <span className="font-rajdhani font-semibold text-lg">{user.username}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="font-mono font-medium">{user.tokens}</span>
                          </div>
                          <motion.span
                            className={`text-sm ${user.change > 0 ? "text-green-400" : "text-red-400"}`}
                            animate={{ opacity: [0.5, 1] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                          >
                            {user.change > 0 ? "↑" : "↓"}
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}

