import { envSchema } from '@xenoculis-monorepo/db'
import { describe, expect, it } from 'vitest'

describe('envSchema', () => {
  it('should validate valid environment', () => {
    const mockDb = {} as D1Database
    const result = envSchema.safeParse({
      DB: mockDb,
      ENVIRONMENT: 'local',
    })
    expect(result.success).toBe(true)
  })

  it('should use default ENVIRONMENT when not provided', () => {
    const mockDb = {} as D1Database
    const result = envSchema.safeParse({
      DB: mockDb,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.ENVIRONMENT).toBe('local')
    }
  })

  it('should reject invalid ENVIRONMENT value', () => {
    const mockDb = {} as D1Database
    const result = envSchema.safeParse({
      DB: mockDb,
      ENVIRONMENT: 'invalid',
    })
    expect(result.success).toBe(false)
  })

  it('should fail when DB is missing', () => {
    const result = envSchema.safeParse({
      ENVIRONMENT: 'local',
    })
    expect(result.success).toBe(false)
  })
})
