import type { Metadata, Viewport } from "next"
import { Manrope, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PwaInitializer } from "@/components/pwa-initializer"
import { cn } from "@/lib/utils"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ASAC V-ATTESTATION",
  description: "Check the validity of your insurance certificate (attestation) instantly.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ASAC V-ATTESTATION",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a568c",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", manrope.variable)}
    >
      <body>
        <ThemeProvider>
          <PwaInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
