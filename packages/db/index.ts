/// <reference types="@cloudflare/workers-types" />
import { drizzle } from 'drizzle-orm/d1'
import { z } from 'zod'

/**
 * Environment variables schema
 */
export const envSchema = z.object({
  DB: z.custom<D1Database>((val) => val !== undefined, { message: 'DB binding is required' }),
  ENVIRONMENT: z.enum(['local', 'staging', 'production']).optional().default('local'),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
})

/**
 * Cloudflare Workers Bindings
 */
export type Bindings = z.infer<typeof envSchema>

/**
 * Parse and validate environment variables
 */
export const parseEnv = (env: unknown): Bindings => {
  const result = envSchema.safeParse(env)
  if (!result.success) {
    console.error('Invalid environment variables:', z.prettifyError(result.error))
    throw new Error('Invalid environment variables')
  }
  return result.data
}

/**
 * Database connection
 */
export const connectDb = (env: Bindings) => {
  return drizzle(env.DB)
}

export type ConnectedDb = ReturnType<typeof connectDb>
