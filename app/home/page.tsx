"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/back-button"
import { useState, useEffect } from "react"

export default function HomePage() {
  const router = useRouter()
  const [showBackButton, setShowBackButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowBackButton(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: ["linear-gradient(45deg, #00ff87, #60efff)", "linear-gradient(45deg, #60efff, #00ff87)"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/56f4da26ed956730309fa1488611ee0f13b0ac95ebb1bc9b5d210e31ff70e79c_IITR12.jpg-AtsAaklmNIxUPTuS76nJG3UUdPKBy1.jpeg')",
          backgroundBlendMode: "overlay",
          opacity: 0.7, // Reduced opacity
        }}
      />

      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            type: "spring",
            bounce: 0.4,
          }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-16 text-center" // Increased text size
        >
          IITR Locator
        </motion.h1>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            bounce: 0.5,
          }}
        >
          <Button
            onClick={() => router.push("/difficulty")}
            className="text-2xl md:text-3xl px-10 py-8 bg-gradient-to-r from-purple-500 to-pink-500 
              hover:from-purple-600 hover:to-pink-600 transition-all duration-500 
              transform hover:scale-110 hover:rotate-1 active:scale-95
              shadow-lg hover:shadow-purple-500/25 rounded-xl" // Increased button size and adjusted styles
          >
            Start Guessing
          </Button>
        </motion.div>
        {showBackButton && <BackButton />}
      </div>
    </div>
  )
}

