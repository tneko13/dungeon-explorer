#!/usr/bin/env node
/**
 * 背景透過バッチスクリプト
 * 使い方: npm run remove-bg [フォルダパス]
 * 例:     npm run remove-bg public/images/enemies
 *
 * 省略時は public/images/enemies を処理します。
 * 処理済みファイルは同名の .png で上書き保存されます。
 */

import { removeBackground } from '@imgly/background-removal-node'
import { readdir, writeFile } from 'fs/promises'
import { resolve, join, extname, basename } from 'path'
import { pathToFileURL } from 'url'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const targetDir = resolve(
  __dirname, '..',
  process.argv[2] ?? 'public/images/enemies'
)

// 画像ファイルのみ対象
const allFiles = await readdir(targetDir)
const imageFiles = allFiles.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))

if (imageFiles.length === 0) {
  console.log(`画像ファイルが見つかりませんでした: ${targetDir}`)
  process.exit(0)
}

console.log(`\n対象フォルダ: ${targetDir}`)
console.log(`対象ファイル: ${imageFiles.length} 件\n`)

let success = 0
let failure = 0

for (let i = 0; i < imageFiles.length; i++) {
  const file = imageFiles[i]
  const inputPath = join(targetDir, file)
  const outputName = basename(file, extname(file)) + '.png'
  const outputPath = join(targetDir, outputName)

  const prefix = `[${String(i + 1).padStart(2)}/${imageFiles.length}]`
  process.stdout.write(`${prefix} ${file.padEnd(36)} ... `)

  try {
    // pathToFileURL で file:// 形式に変換（Windowsパスの c: 誤認を回避）
    const fileUrl = pathToFileURL(inputPath).href
    const blob = await removeBackground(fileUrl)
    const buffer = Buffer.from(await blob.arrayBuffer())
    await writeFile(outputPath, buffer)
    console.log('✓ 完了')
    success++
  } catch (e) {
    console.log(`✗ エラー: ${e.message}`)
    failure++
  }
}

console.log(`\n完了: 成功 ${success} / 失敗 ${failure} / 合計 ${imageFiles.length}`)
