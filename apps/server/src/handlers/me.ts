import type { RouteHandler } from '@hono/zod-openapi'
import type { Bindings } from '@xenoculis-monorepo/db'
import type { getMeRoute } from '../routes/me'
import { successResponse } from '../utils/responseHelpers'

export const getMeHandler: RouteHandler<typeof getMeRoute, { Bindings: Bindings }> = (c) => {
  // TODO: 認証有効時は getAuth(c) から userId を取得
  return successResponse(c, { userId: 'anonymous' })
}
