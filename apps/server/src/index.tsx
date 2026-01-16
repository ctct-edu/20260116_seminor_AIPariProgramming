import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@xenoculis-monorepo/db'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import * as handlers from './handlers'
import * as routes from './routes'
import { internalServerErrorResponse } from './utils/responseHelpers'

const title = 'API Template'
const version = 'v1'
const openApiVersion = '3.0.0'
const description = 'Hono + Cloudflare Workers API Template'

const app = new OpenAPIHono<{ Bindings: Bindings }>()

/**
 * Global Error Handler
 */
app.onError(async (error, c) => {
  if (error instanceof HTTPException) return error.getResponse()
  console.error(error)
  return internalServerErrorResponse(c, 'サーバーエラーが発生しました')
})

/**
 * CORS Middleware
 */
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
    credentials: true,
  }),
)

/**
 * Auth Middleware (disabled for development)
 */
// import { clerkMiddleware } from '@hono/clerk-auth'
// import * as middlewares from './middlewares'
// app.use('*', clerkMiddleware())
// app.use('/api/*', middlewares.commonAuthMiddleware)

/**
 * Routes
 */
app.openapi(routes.healthRoute, handlers.healthHandler)
app.openapi(routes.getMeRoute, handlers.getMeHandler)

/**
 * Swagger UI
 */
app.doc('/docs/json', { openapi: openApiVersion, info: { version, title, description } })
app.get('/docs', swaggerUI({ url: '/docs/json', title: `${title} - Swagger UI` }))

export type ApiRoutes = typeof app

export default { fetch: app.fetch }
