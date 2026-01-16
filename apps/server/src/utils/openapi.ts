import { z } from '@hono/zod-openapi'
import type { ClientErrorStatusCode, ServerErrorStatusCode } from 'hono/utils/http-status'

/**
 * application/json 用の request body のヘルパー関数
 */
export function jsonBodySchema<T extends z.ZodType>(schema: T, description?: string, example?: z.infer<T>) {
  return { ...(description ? { description } : {}), content: { 'application/json': { schema, example } } } as const
}

/**
 * サクセスレスポンスは data ラッパーを使用する
 */
export function DataSchema<T extends z.ZodType>(schema: T, _example?: z.infer<T>) {
  return z.object({ data: schema })
}

/**
 * application/json 用の response のヘルパー関数
 */
export function jsonResponseSchema<T extends z.ZodType>(schema: T, description = 'OK', example?: z.infer<T>) {
  return { description, content: { 'application/json': { schema, example } } } as const
}

/**
 * エラーレスポンスの JSON を生成するヘルパー関数 (RFC 9457 準拠)
 */
export function jsonErrorResponse(
  status: ClientErrorStatusCode | ServerErrorStatusCode,
  title: string,
  detail: string,
  type = 'about:blank',
  instance?: string,
) {
  return { type, title, status, detail, ...(instance && { instance }) }
}
