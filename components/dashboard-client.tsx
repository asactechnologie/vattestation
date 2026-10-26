"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import the dashboard with SSR disabled to ensure client-side only execution
export const DashboardClient = dynamic(
  () => import("@/components/dashboard").then((mod) => mod.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full min-h-[460px] items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    ),
  }
)
