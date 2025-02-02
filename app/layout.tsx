import "./globals.css"
import { Orbitron } from "next/font/google"
import Header from "@/components/header"
import { UserProvider } from "@/contexts/user-context"
import { Toaster } from "sonner"
import dynamic from "next/dynamic"
import type React from "react"
import { BackButton } from "@/components/back-button"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

const ClientProvider = dynamic(() => import("@/components/client-provider"), { ssr: false })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body className="font-orbitron">
        <ClientProvider>
          <UserProvider>
            <Header />
            <BackButton />
            {children}
            <Toaster />
          </UserProvider>
        </ClientProvider>
      </body>
    </html>
  )
}

