"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/contexts/user-context"
import { GoogleMap } from "@/components/google-map"
import { isWithinRange } from "@/lib/locationUtils"
import { solvePuzzle } from "@/lib/web3"

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

interface PuzzlePageProps {
  params: {
    difficulty: string
  }
}

const difficultyColors = {
  easy: {
    gradient: "from-green-400 to-emerald-600",
    glow: "green-400",
    bg: "from-green-500/20 via-emerald-500/10 to-transparent",
  },
  medium: {
    gradient: "from-yellow-400 to-orange-600",
    glow: "yellow-400",
    bg: "from-yellow-500/20 via-orange-500/10 to-transparent",
  },
  hard: {
    gradient: "from-red-400 to-rose-600",
    glow: "red-400",
    bg: "from-red-500/20 via-rose-500/10 to-transparent",
  },
}

export default function PuzzlePage({ params }: PuzzlePageProps) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null)
  const [enlargedPuzzle, setEnlargedPuzzle] = useState<number | null>(null)
  const colors = difficultyColors[params.difficulty as keyof typeof difficultyColors]
  const { contract, walletAddress, updateUserData, isContractInitialized, connectWallet } = useUser()
  const [puzzles, setPuzzles] = useState<
    Array<{ id: number; image: string; solved: boolean; metadataCID: string; location: string }>
  >([
    {
      id: 1,
      image: `https://gateway.pinata.cloud/ipfs/bafybeicc6zdoezfdowqwi3danugvd5lvl52ulbdbvdiwul3xr37c4c5ugu`,
      metadataCID: "bafkreigdc6b45hqbhg45litjk2jzse7v4i6hlzvcs2m47owgmcfewzkm3y",
      solved: false,
      location: "29.870712, 77.893675",
    },
    {
      id: 2,
      image: `https://gateway.pinata.cloud/ipfs/bafybeihd2dnbku3sr5wjrl7is4mtlmy3ty4xquxjmtdchhx4ysq7hrrzqa`,
      metadataCID: "bafkreic45hwncd3t5dwaym5wk32gisy4k6zby2mwj4fkmo6vbrxytwlpz4",
      solved: false,
      location: "29.8675542, 77.9002410",
    },
    {
      id: 3,
      image: `https://gateway.pinata.cloud/ipfs/bafybeiaw4nvj4tvytkibeiymm7b7adk5gjdmx336xnflog5gxr7xpyznwu`,
      metadataCID: "bafkreich6b25uuakfwtnb4slj2zpkmegpr7lq3prxggfhls5752iphdwti",
      solved: false,
      location: "29.8635601, 77.9011177",
    },
    {
      id: 4,
      image: `https://gateway.pinata.cloud/ipfs/bafybeicuwtt5bkoznpjfq7w3iiam5fcdqr2um7et37wdnu4gr7z7xhpkdq`,
      metadataCID: "bafkreiauax3z7geijt3cjo7dotsfb6f2z7oihykkyxvmsbspijwkzheskm",
      solved: false,
      location: "29.8642641, 77.8999138",
    },
    {
      id: 5,
      image: `https://gateway.pinata.cloud/ipfs/bafybeib7frzcvmydjdirwsokc4a5rlccqllxqyzosg373censfup4ilvae`,
      metadataCID: "bafkreih5xn3vbyl5t27cvir2l3cgrkc5hbl7gumwl7htjzm7afggzyblvy",
      solved: false,
      location: "29.8644818, 77.8935405",
    },
    {
      id: 6,
      image: `https://gateway.pinata.cloud/ipfs/bafybeiaixkxo5vfkjuxvigtazefrmk7kkaqbrxz5uon76j3qdj35qs64cq`,
      metadataCID: "bafkreiaidp2g4iux6u7a6ewjn6ikuthwqdubff3azklrzqpxgaozxijpf4",
      solved: false,
      location: "29.8642803, 77.8947357",
    },
    {
      id: 7,
      image: `https://gateway.pinata.cloud/ipfs/bafybeietuniimwvsccbonmohveiju7uuv5rd2k4vhaztzcpgfhfmw4zm6e`,
      metadataCID: "bafkreihe4qzft6cuktxxtfcorg4q77cfc57lguz6dbrogfcbyjweoicfv4",
      solved: false,
      location: "29.8618298, 77.8962348",
    },
    {
      id: 8,
      image: `https://gateway.pinata.cloud/ipfs/bafybeifwjte5riuzwegeq2mlirgzj4unrmwx5pp4llnzshual65ffkqyjm`,
      metadataCID: "bafkreig7js4dj222gnjsz6oo6yi7oidrwda4wsfrvxt43vs35wjgbrlhya",
      solved: false,
      location: "29.8631737, 77.9026808",
    },
  ])
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
  }

  const handleGuess = async () => {
    console.log("handleGuess called")
    console.log("enlargedPuzzle:", enlargedPuzzle)
    console.log("selectedLocation:", selectedLocation)

    if (!selectedLocation) {
      toast.error("Please select a location first")
      return
    }

    if (!enlargedPuzzle) {
      toast.error("No puzzle selected. Please try again.")
      return
    }

    if (!isContractInitialized) {
      toast.error("Contract not initialized. Please connect your wallet and try again.")
      return
    }

    const puzzle = puzzles.find((p) => p.id === enlargedPuzzle)
    if (!puzzle) {
      toast.error("Selected puzzle not found. Please try again.")
      return
    }

    const [targetLat, targetLng] = puzzle.location.split(",").map((str) => Number(str.trim()))

    console.log("Selected:", selectedLocation.lat, selectedLocation.lng)
    console.log("Target:", targetLat, targetLng)

    if (isWithinRange(selectedLocation.lat, selectedLocation.lng, targetLat, targetLng, 10)) {
      try {
        if (contract) {
          await solvePuzzle(contract, enlargedPuzzle)
          toast.success("Congratulations! You found the correct location!")
          setPuzzles((prevPuzzles) => prevPuzzles.map((p) => (p.id === enlargedPuzzle ? { ...p, solved: true } : p)))
          setShowMap(false)
          setEnlargedPuzzle(null)
          setSelectedLocation(null)
          updateUserData()
        } else {
          toast.error("Contract not initialized. Please try again.")
        }
      } catch (error) {
        console.error("Error solving puzzle:", error)
        toast.error("An error occurred while solving the puzzle. Please try again.")
      }
    } else {
      toast.error("Wrong location! Try again. Remember, you need to be within 10 meters of the actual location.")
    }
  }

  useEffect(() => {
    if (!isContractInitialized) {
      connectWallet()
    }
  }, [isContractInitialized, connectWallet])

  useEffect(() => {
    if (contract && walletAddress) {
      try {
        const updatedPuzzles = Promise.all(
          puzzles.map(async (puzzle) => {
            const isSolved = await contract.hasSolvedPuzzle(walletAddress, puzzle.id)
            return { ...puzzle, solved: isSolved }
          }),
        )
        updatedPuzzles.then((updatedPuzzles) => setPuzzles(updatedPuzzles))
      } catch (error) {
        console.error("Error checking solved puzzles:", error)
      }
    }
  }, [contract, puzzles, walletAddress])

  return (
    <div className="min-h-screen relative overflow-hidden bg-black font-orbitron">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, rgb(var(--${params.difficulty}-primary)) 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 80%, rgb(var(--${params.difficulty}-secondary)) 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 80%, rgb(var(--${params.difficulty}-primary)) 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, rgb(var(--${params.difficulty}-secondary)) 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <FloatingShapes />

      <div className="relative z-10 container mx-auto py-24 px-4">
        <motion.h1
          className={`text-6xl md:text-7xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r ${colors.gradient}`}
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
          {params.difficulty.charAt(0).toUpperCase() + params.difficulty.slice(1)} Mode
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-center text-white/70 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Find these locations around IITR campus
        </motion.p>

        {!isContractInitialized && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <p className="text-red-500 mb-4">Contract not initialized. Please connect your wallet to play.</p>
            <Button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-600 text-white">
              Connect Wallet
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {puzzles.map((puzzle, index) => (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative group"
              onClick={() => setEnlargedPuzzle(puzzle.id)}
            >
              {/* Glow effect */}
              <motion.div
                className={`absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r ${colors.gradient} blur`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <motion.div
                className={`relative p-1 rounded-xl backdrop-blur-sm overflow-hidden
                  ${puzzle.solved ? "bg-green-500/20" : "bg-black/50"}
                  transition-all duration-300 group-hover:scale-[1.02]`}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={puzzle.image || "/placeholder.svg"}
                    alt={`Puzzle ${puzzle.id}`}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110`}
                  />

                  {/* Status overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {puzzle.solved ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500/90 rounded-full p-2"
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-white font-bold text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{ scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {puzzle.id}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {enlargedPuzzle !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setEnlargedPuzzle(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative w-11/12 max-w-4xl h-[90vh] bg-black/80 rounded-xl overflow-hidden p-4 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex-grow overflow-hidden">
                  <img
                    src={puzzles[enlargedPuzzle - 1]?.image || "/placeholder.svg"}
                    alt={`Puzzle ${enlargedPuzzle}`}
                    className="w-full h-full object-contain rounded-lg max-h-[calc(90vh-120px)]"
                  />
                </div>
                <div className="flex justify-between mt-4 pt-2 border-t border-white/10">
                  <Button onClick={() => setShowMap(true)} className="bg-green-500 hover:bg-green-600 text-white">
                    Solve Puzzle
                  </Button>
                  <Button onClick={() => setEnlargedPuzzle(null)} className="bg-red-500 hover:bg-red-600 text-white">
                    Back
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowMap(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative w-[80vw] h-[80vh] bg-black/80 rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <GoogleMap onLocationSelect={handleLocationSelect} onGuess={handleGuess} />
                <Button
                  className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                  variant="ghost"
                  onClick={() => {
                    setShowMap(false)
                    setSelectedLocation(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

