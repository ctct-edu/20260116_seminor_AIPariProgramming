import type { RouteHandler } from '@hono/zod-openapi'
import type { Bindings } from '@xenoculis-monorepo/db'
import type { healthRoute } from '../routes/health'
import { successResponse } from '../utils/responseHelpers'

export const healthHandler: RouteHandler<typeof healthRoute, { Bindings: Bindings }> = (c) => {
  return successResponse(c, { status: 'ok' })
}
