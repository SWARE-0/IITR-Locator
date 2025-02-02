"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Baby, Sword, Skull } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

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

const backgroundImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203.jpg-scFuxKwfAcdUpDZ5nTs6jym37PQ1gu.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%208.jpg-6bkqSl3Jlql5F9Fu2gzHim00e8cQRj.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%202.jpg-AwqCu4VEavAhLH4zzk487G5mXak29M.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206.jpg-6LP1x9mrd7HtPOgl1eRgLRrgKLj5AB.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2010.jpg-XOqHba06m8MFUxmh4l0FyEOd1LdGjW.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2011.jpg-mmM0OTPpZasnFDuceTgwdDk4lT6mET.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2013.jpg-tpfIYq7Vd9R49gYJ1Pv9fjjQSBawgO.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-min.jpg-VbRuCOV7ywEFajbSvPY6SYGgIe81UX.jpeg",
]

export default function DifficultyPage() {
  const router = useRouter()
  const { tokens, isMediumUnlocked, isHardUnlocked } = useUser()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const difficulties = [
    {
      name: "Easy",
      color: "from-green-400 to-emerald-600",
      glowColor: "green-400",
      delay: 0.2,
      icon: Baby,
      description: "Perfect for beginners",
      tokenReward: "10 tokens per puzzle",
      unlocked: true,
      bgGradient: "from-green-500/20 via-emerald-500/10 to-transparent",
    },
    {
      name: "Medium",
      color: "from-yellow-400 to-orange-600",
      glowColor: "yellow-400",
      delay: 0.4,
      icon: Sword,
      description: "For experienced players",
      tokenReward: "15 tokens per puzzle",
      unlocked: isMediumUnlocked,
      requiredTokens: 80,
      bgGradient: "from-yellow-500/20 via-orange-500/10 to-transparent",
    },
    {
      name: "Hard",
      color: "from-red-400 to-rose-600",
      glowColor: "red-400",
      delay: 0.6,
      icon: Skull,
      description: "Ultimate challenge",
      tokenReward: "20 tokens per puzzle",
      unlocked: isHardUnlocked,
      requiredTokens: 200,
      bgGradient: "from-red-500/20 via-rose-500/10 to-transparent",
    },
  ]

  const handleDifficultySelect = (difficulty: (typeof difficulties)[0]) => {
    if (difficulty.unlocked) {
      router.push(`/puzzles/${difficulty.name.toLowerCase()}`)
    } else {
      // You can add a toast notification here to inform the user that the difficulty is locked
      toast.error(`${difficulty.name} mode is locked. You need ${difficulty.requiredTokens} tokens to unlock it.`)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 z-0"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            animate={{ scale: [1, 1.1] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </motion.div>
      </AnimatePresence>

      <FloatingShapes />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
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
            Select Difficulty
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Choose your challenge level
          </motion.p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-6xl px-4 justify-center">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon
            return (
              <motion.div
                key={difficulty.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: difficulty.delay,
                  duration: 0.6,
                  type: "spring",
                }}
                className="flex-1"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => handleDifficultySelect(difficulty)}
                        className={`relative w-full h-[300px] bg-gradient-to-r ${difficulty.color} 
                          rounded-xl border-2 border-white/10 backdrop-blur-sm
                          transition-all duration-500 overflow-hidden
                          ${!difficulty.unlocked && "opacity-50"}
                          ${difficulty.unlocked && "hover:scale-105 hover:shadow-lg hover:shadow-" + difficulty.glowColor + "/30"}
                        `}
                        whileHover={difficulty.unlocked ? { y: -5 } : {}}
                        whileTap={difficulty.unlocked ? { scale: 0.98 } : {}}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-b ${difficulty.bgGradient}`} />

                        <div className="relative h-full flex flex-col items-center justify-center gap-6 p-6">
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                            }}
                          >
                            <Icon size={60} className="text-white" />
                          </motion.div>

                          <div className="text-center">
                            <h3 className="text-4xl font-bold text-white mb-3">{difficulty.name}</h3>
                            <p className="text-xl text-white/90 mb-2">{difficulty.description}</p>
                            <p className="text-lg text-white/80">{difficulty.tokenReward}</p>
                          </div>
                        </div>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 border-none text-white p-4 backdrop-blur-lg" sideOffset={5}>
                      {!difficulty.unlocked ? (
                        <>
                          <p className="text-lg">Requires {difficulty.requiredTokens} tokens to unlock</p>
                          <p className="text-sm opacity-75 mt-1">You have: {tokens} tokens</p>
                        </>
                      ) : (
                        <p className="text-lg">Click to start {difficulty.name} mode</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )
          })}
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
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

