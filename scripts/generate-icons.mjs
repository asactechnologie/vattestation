// Generates the PWA icons, apple-icon and favicon.ico from public/assets/logo_asac.png.
// Usage: pnpm add -D playwright && node scripts/generate-icons.mjs   (renders with the local Google Chrome)
import { chromium } from "playwright"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dirname, "..")
const logoPath = join(root, "public/assets/logo_asac.png")
const logo = "data:image/png;base64," + readFileSync(logoPath).toString("base64")

// Logo source regions (1000x1000 artwork): globe mark and ASAC wordmark
const GLOBE = { x: 180, y: 100, w: 640, h: 635 }
const WORD = { x: 285, y: 760, w: 425, h: 135 }

function part(r, dx, dy, scale, clipId, filter = "white") {
  return `<g transform="translate(${dx} ${dy}) scale(${scale}) translate(${-r.x} ${-r.y})">
    <clipPath id="${clipId}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/></clipPath>
    <image href="${logo}" width="1000" height="1000" clip-path="url(#${clipId})" filter="url(#${filter})"/>
  </g>`
}

function svg(variant) {
  const full = variant === "maskable" || variant === "apple"
  const minimal = variant === "favicon"
  // Content scale: maskable keeps everything inside the 80% safe zone
  const k = variant === "maskable" ? 0.78 : variant === "apple" ? 0.92 : 1
  const radius = full ? 0 : minimal ? 200 : 228

  let content
  if (minimal) {
    const s = 760 / GLOBE.w
    content = part(GLOBE, (1024 - GLOBE.w * s) / 2, (1024 - GLOBE.h * s) / 2 + 6, s, "g", "whiteBold")
  } else {
    const gs = 560 / GLOBE.w
    const ws = 250 / WORD.w
    const gx = (1024 - GLOBE.w * gs) / 2 + 8, gy = 150
    const wx = (1024 - WORD.w * ws) / 2, wy = gy + GLOBE.h * gs + 40
    const sy = wy + WORD.h * ws + 30, sw = 120
    content = `
      ${part(GLOBE, gx, gy, gs, "g")}
      ${part(WORD, wx, wy, ws, "w")}
      <g transform="translate(${512 - sw / 2} ${sy})">
        <rect width="${sw / 3}" height="10" rx="5" fill="#16a34a"/>
        <rect x="${sw / 3}" width="${sw / 3}" height="10" fill="#dc2626"/>
        <rect x="${(2 * sw) / 3}" width="${sw / 3}" height="10" rx="5" fill="#facc15"/>
      </g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2a5fd6"/>
      <stop offset="0.5" stop-color="#163a8a"/>
      <stop offset="1" stop-color="#081a45"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.45">
      <stop offset="0" stop-color="#60a5fa" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#60a5fa" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sheen" cx="0.25" cy="0.05" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.15"/>
    </linearGradient>
    <filter id="white" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
    </filter>
    <!-- Small sizes: merge the stripes into a solid globe so the continent cut-out stays legible -->
    <filter id="whiteBold" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
      <feMorphology operator="dilate" radius="24"/>
      <feMorphology operator="erode" radius="18"/>
    </filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#020a24" flood-opacity="0.55"/>
    </filter>
    <clipPath id="shape"><rect width="1024" height="1024" rx="${radius}"/></clipPath>
  </defs>
  <g clip-path="url(#shape)">
    <rect width="1024" height="1024" fill="url(#bg)"/>
    <rect width="1024" height="1024" fill="url(#glow)"/>
    <circle cx="512" cy="${minimal ? 512 : 420}" r="${minimal ? 430 : 360}" fill="none" stroke="#93c5fd" stroke-opacity="0.18" stroke-width="3" transform="translate(${512 * (1 - k)} ${512 * (1 - k)}) scale(${k})"/>
    <g filter="url(#shadow)" transform="translate(${512 * (1 - k)} ${512 * (1 - k)}) scale(${k})">${content}</g>
    <rect width="1024" height="1024" fill="url(#sheen)"/>
    ${full ? "" : `<rect x="3" y="3" width="1018" height="1018" rx="${radius - 3}" fill="none" stroke="url(#edge)" stroke-width="6"/>`}
  </g>
</svg>`
}

const targets = [
  ["public/asac_icon_512.png", "any", 512],
  ["public/asac_icon_192.png", "any", 192],
  ["public/asac_icon_maskable_512.png", "maskable", 512],
  ["public/asac_icon_maskable_192.png", "maskable", 192],
  ["app/icon.png", "any", 512],
  ["app/apple-icon.png", "apple", 180],
  ["favicon-48", "favicon", 48],
  ["favicon-32", "favicon", 32],
  ["favicon-16", "favicon", 16],
]
const faviconPngs = []

const browser = await chromium.launch({ channel: "chrome" })
// Headless Chrome misrenders tiny viewports: keep a large one and clip to the icon size
const page = await browser.newPage({ viewport: { width: 1100, height: 1100 } })
for (const [name, variant, size] of targets) {
  await page.setContent(`<html><body style="margin:0;background:transparent;overflow:hidden">
    <div style="width:${size}px;height:${size}px;overflow:hidden;line-height:0">${svg(variant).replace("width=\"1024\" height=\"1024\">", `width="${size}" height="${size}" style="display:block">`)}</div></body></html>`)
  const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
  if (variant === "favicon") faviconPngs.push([size, png])
  else writeFileSync(join(root, name), png)
}
await browser.close()

// favicon.ico with embedded PNG entries (16, 32, 48)
const header = Buffer.alloc(6 + 16 * faviconPngs.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(faviconPngs.length, 4)
let offset = header.length
faviconPngs.sort((a, b) => a[0] - b[0]).forEach(([size, png], i) => {
  const e = 6 + 16 * i
  header.writeUInt8(size, e)
  header.writeUInt8(size, e + 1)
  header.writeUInt16LE(1, e + 4)
  header.writeUInt16LE(32, e + 6)
  header.writeUInt32LE(png.length, e + 8)
  header.writeUInt32LE(offset, e + 12)
  offset += png.length
})
writeFileSync(join(root, "app/favicon.ico"), Buffer.concat([header, ...faviconPngs.map(([, png]) => png)]))
console.log("Icons generated")
