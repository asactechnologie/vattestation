import type { Metadata } from "next"

import { Header } from "@/components/header"
import { NotFoundContent } from "@/components/not-found-content"

export const metadata: Metadata = {
  title: "404 - Page introuvable",
  description: "La page que vous recherchez n'existe pas ou a été déplacée.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background font-sans">
      <Header />
      <main className="flex flex-1 flex-col">
        <NotFoundContent />
      </main>
    </div>
  )
}
