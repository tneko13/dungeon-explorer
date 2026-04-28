import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32.png', 'icons/apple-touch-icon.png', 'icons/icon.svg'],
      manifest: {
        name: 'Arveil Chronicle',
        short_name: 'Arveil',
        description: '深淵の謎を巡るパーティ探索RPG。冒険者を派遣してダンジョンを踏破せよ。',
        theme_color: '#0f0f23',
        background_color: '#0f0f23',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ja',
        start_url: '/dungeon-explorer/',
        scope: '/dungeon-explorer/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // 画像・フォントなど大きいアセットはキャッシュしつつ、
        // ゲームデータはネットワーク優先で最新を取得
        runtimeCaching: [
          {
            urlPattern: /\/images\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'game-images',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  base: '/dungeon-explorer/',
  server: {
    host: true,
  },
})
