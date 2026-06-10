"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import the dashboard with SSR disabled to ensure client-side only execution
const Dashboard = dynamic(() => import("@/components/dashboard").then(mod => mod.Dashboard), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  ),
})

export default function Page() {
  return <Dashboard />
}
