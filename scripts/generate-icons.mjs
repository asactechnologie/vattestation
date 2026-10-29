// Generates the PWA icons, apple-icon and favicon.ico from the editable SVG sources in assets/icons/.
// Edit the SVGs (Figma, Illustrator, Inkscape or a text editor), then run:
//   pnpm add -D playwright && node scripts/generate-icons.mjs   (renders with the local Google Chrome)
import { chromium } from "playwright"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dirname, "..")
const src = (name) => readFileSync(join(root, "assets/icons", name), "utf8")

// [source SVG, output file, size in px]
const targets = [
  ["icon.svg", "public/asac_icon_512.png", 512],
  ["icon.svg", "public/asac_icon_192.png", 192],
  ["icon.svg", "app/icon.png", 512],
  ["icon-maskable.svg", "public/asac_icon_maskable_512.png", 512],
  ["icon-maskable.svg", "public/asac_icon_maskable_192.png", 192],
  ["icon-apple.svg", "app/apple-icon.png", 180],
]
const faviconSizes = [16, 32, 48]

const browser = await chromium.launch({ channel: "chrome" })
// Headless Chrome misrenders tiny viewports: keep a large one and clip to the icon size
const page = await browser.newPage({ viewport: { width: 1100, height: 1100 } })

async function render(svg, size) {
  const sized = svg.replace(/<svg([^>]*?)\swidth="\d+"\sheight="\d+"/, `<svg$1 width="${size}" height="${size}" style="display:block"`)
  await page.setContent(`<html><body style="margin:0;background:transparent;overflow:hidden">${sized}</body></html>`)
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

for (const [source, output, size] of targets) {
  writeFileSync(join(root, output), await render(src(source), size))
  console.log(`${output} (${size}px)`)
}

// favicon.ico with embedded PNG entries
const pngs = []
for (const size of faviconSizes) pngs.push([size, await render(src("favicon.svg"), size)])
await browser.close()

const header = Buffer.alloc(6 + 16 * pngs.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(pngs.length, 4)
let offset = header.length
pngs.forEach(([size, png], i) => {
  const e = 6 + 16 * i
  header.writeUInt8(size, e)
  header.writeUInt8(size, e + 1)
  header.writeUInt16LE(1, e + 4)
  header.writeUInt16LE(32, e + 6)
  header.writeUInt32LE(png.length, e + 8)
  header.writeUInt32LE(offset, e + 12)
  offset += png.length
})
writeFileSync(join(root, "app/favicon.ico"), Buffer.concat([header, ...pngs.map(([, png]) => png)]))
console.log(`app/favicon.ico (${faviconSizes.join("/")}px)`)
