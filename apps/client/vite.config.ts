import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), tailwindcss(), react()],
  resolve: { alias: { '@': '/src' } },
  /**
   * Cloudflare Pages の本番環境では、この設定は効かない。
   * public/_redirects には、本番環境の API の URL を記載する。
   * @link [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
   */
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        // フロントエンドの '/api/' が、サーバサイドの API ルート '/' になるようにリライト
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
