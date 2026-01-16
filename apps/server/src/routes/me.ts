import { createRoute, z } from '@hono/zod-openapi'
import { DataSchema, jsonResponseSchema } from '../utils/openapi'

export const getMeRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['User'],
  responses: {
    200: jsonResponseSchema(
      DataSchema(
        z.object({
          userId: z.string(),
        }),
      ),
      'Current user info',
    ),
  },
})
