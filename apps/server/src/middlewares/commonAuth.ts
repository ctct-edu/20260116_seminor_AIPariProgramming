import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

/**
 * 共通認証ミドルウェア
 *
 * @link studentAuthMiddleware
 */
export const commonAuthMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c)
  const userId = auth?.userId

  if (!userId) {
    console.log('CommonAuthMiddleware: ログインされていません.')
    console.log(auth)

    throw new HTTPException(401, { message: 'ログインされていません.' })
  }

  await next()
})
