import { type DetailedError, parseResponse } from 'hono/client'
import { api, tokenHeaderOption } from './client'

/**
 * ログイン中のユーザー情報を取得する
 */
export async function getMe(token: string | null = null) {
  const result = await parseResponse(api.me.$get({}, tokenHeaderOption(token))).catch((e: DetailedError) => {
    throw new Error(`ユーザー情報の取得に失敗しました: ${e}`)
  })

  return result.data
}
