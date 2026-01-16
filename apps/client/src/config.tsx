import { z } from 'zod'

const envSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().optional().default(''),
  VITE_API_URL: z.url().optional().default('http://localhost:8787'),
})

const parseEnv = () => {
  const result = envSchema.safeParse(import.meta.env)
  if (!result.success) {
    console.error('Invalid environment variables:', z.prettifyError(result.error))
    throw new Error('Invalid environment variables')
  }
  return result.data
}

const env = parseEnv()

export const CLERK_PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY
export const API_URL = env.VITE_API_URL
