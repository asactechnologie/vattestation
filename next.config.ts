import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.168"],
  // vattestation.cm is the canonical domain: send every other production host there
  // with a permanent redirect so search engines consolidate ranking on a single URL.
  async redirects() {
    return ["vattestation.asac-cameroun.org", "www.vattestation.cm"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://vattestation.cm/:path*",
      permanent: true,
    }))
  },
}

export default nextConfig
