import type { ApiRoutes } from '@xenoculis-monorepo/server'
import { hc } from 'hono/client'
import { CLOUDFLARE_API_URL } from '../config'

const baseUrl = import.meta.env.DEV ? '/api/' : CLOUDFLARE_API_URL

/**
 * バックエンド API クライアント
 *
 * @note ローカルでは Vite の server proxy により 8787 に転送
 * @note 本番環境では API_URL に Cloudflare Workers の URL を指定
 */
export const api = hc<ApiRoutes>(baseUrl)

/**
 * 認証トークンをヘッダーに追加
 */
export const tokenHeaderOption = (token: string | null) => {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}
