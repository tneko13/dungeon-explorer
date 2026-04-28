/**
 * SVG → PNG アイコン生成スクリプト
 * 使い方: node scripts/gen-icons.mjs
 */
import sharp from 'sharp'
import { readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const svgPath = resolve(root, 'public/icons/icon.svg')
const svgBuffer = await readFile(svgPath)

const sizes = [
  { size: 192,  out: 'public/icons/icon-192.png' },
  { size: 512,  out: 'public/icons/icon-512.png' },
  { size: 180,  out: 'public/icons/apple-touch-icon.png' },  // iOS
  { size: 32,   out: 'public/favicon-32.png' },
]

for (const { size, out } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(resolve(root, out))
  console.log(`✓ ${out} (${size}x${size})`)
}
console.log('\nアイコン生成完了')
