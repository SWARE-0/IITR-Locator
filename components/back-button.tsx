"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 left-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-50 transition-all duration-300 hover:scale-110"
      onClick={() => router.back()}
    >
      <ArrowLeft size={24} />
      <span className="sr-only">Go back</span>
    </Button>
  )
}

