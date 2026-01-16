import { createRoute, z } from '@hono/zod-openapi'
import { DataSchema, jsonResponseSchema } from '../utils/openapi'

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: jsonResponseSchema(DataSchema(z.object({ status: z.string() })), 'Health check response'),
  },
})
