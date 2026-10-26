import type { Metadata } from "next"

import { Header } from "@/components/header"
import { HomeIntro } from "@/components/home-intro"
import { DashboardClient } from "@/components/dashboard-client"
import { SiteFooter } from "@/components/site-footer"
import { JsonLd } from "@/components/json-ld"
import { organizationJsonLd, webApplicationJsonLd, websiteJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function Page() {
  return (
    <div className="min-h-svh bg-background transition-colors duration-300 flex flex-col font-sans pb-4 overflow-x-hidden">
      <JsonLd data={[organizationJsonLd, websiteJsonLd, webApplicationJsonLd]} />

      {/* Brand Header */}
      <Header />

      {/* Main Core Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col items-center space-y-8">
        <HomeIntro />
        <DashboardClient />
      </main>

      <SiteFooter />
    </div>
  )
}
