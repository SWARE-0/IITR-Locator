"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { connectWallet } from "@/lib/web3"
import { toast } from "sonner"
import { Wallet } from "lucide-react"
import { useUser } from "@/contexts/user-context"

// Floating shapes component
const FloatingShapes = () => {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-white/10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            filter: "blur(8px)",
          }}
        />
      ))}
    </>
  )
}

export default function ConnectWalletPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setWalletAddress, updateUserData } = useUser()

  const handleMetaMaskLogin = async () => {
    try {
      setIsLoading(true)
      const { address, signer, contract } = await connectWallet()
      setWalletAddress(address)
      await updateUserData(address, contract)
      toast.success(`Connected with address: ${address.slice(0, 6)}...${address.slice(-4)}`)
      router.push("/home")
    } catch (error: any) {
      console.error("MetaMask login error:", error)
      toast.error(error.message || "An error occurred during MetaMask connection")
    } finally {
      setIsLoading(false)
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      rotate: [-1, 1, -1],
      transition: {
        rotate: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.5,
        },
      },
    },
    tap: { scale: 0.95 },
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, #f59e0b 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, #f97316 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, #f59e0b 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #f97316 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <FloatingShapes />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 font-orbitron"
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
            Connect Wallet
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-orange-200/90 font-rajdhani font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Link your MetaMask wallet to start your journey and track achievements on the blockchain
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-2xl opacity-75 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 blur-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.button
            onClick={handleMetaMaskLogin}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
            className="relative px-12 py-8 text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-orange-500/25"
          >
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 rounded-xl transition-opacity duration-300" />
            {isLoading ? (
              <motion.div
                className="flex items-center gap-3"
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Connecting...
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                Connect MetaMask
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* MetaMask-themed floating elements */}
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl"
          style={{
            top: "20%",
            right: "15%",
            filter: "blur(40px)",
          }}
          animate={{
            y: [0, 20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full"
          style={{
            bottom: "25%",
            left: "10%",
            filter: "blur(40px)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  )
}

