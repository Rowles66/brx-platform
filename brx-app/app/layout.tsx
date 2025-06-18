import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { TrpcProvider } from "@/lib/trpc-provider" // Updated path

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BRX Performance Dashboard",
  description: "Athlete Performance Management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  )
}
