"use client"

import { useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const controls = useAnimation()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically handle authentication
      // For now, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/connect-wallet")
    } catch (error: any) {
      console.error("Authentication error:", error)
      toast.error(error.message || "An error occurred during authentication")
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

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(192, 132, 252, 0.2)",
        "0 0 60px rgba(192, 132, 252, 0.4)",
        "0 0 20px rgba(192, 132, 252, 0.2)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, #4f46e5 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, #7c3aed 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, #4f46e5 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <FloatingShapes />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-7xl md:text-9xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-500 font-orbitron"
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
            IITR LOCATOR
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-teal-200/90 font-rajdhani font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Explore. Discover. Navigate.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-white">{isLogin ? "Login" : "Create Account"}</CardTitle>
              <CardDescription className="text-gray-400">
                {isLogin ? "Enter your credentials to continue" : "Sign up for a new account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    disabled={isLoading}
                    required
                  />
                </div>

                <motion.div variants={glowVariants} animate="animate" whileHover="hover" className="relative group">
                  <motion.div
                    className="absolute -inset-1 rounded-xl opacity-75 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 blur"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <motion.button
                    type="submit"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="relative w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                      />
                    ) : (
                      "Enter the World"
                    )}
                  </motion.button>
                </motion.div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"
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
      </div>
    </div>
  )
}

