import type { Context } from 'hono'

/**
 * 200 Success レスポンス
 *
 * successResponse(c, { message: '成功' }) => { data: { message: '成功' } }
 *
 * このように { data } のように渡すことで、 data でラップして返す。
 */
export const successResponse = <T>(c: Context, data: T) => c.json({ data }, 200)

/**
 * 400 Bad Request エラーレスポンス
 */
export const badRequestResponse = (c: Context, detail: string, instance?: string) =>
  c.json(
    {
      type: 'about:blank/bad-request',
      title: 'Bad Request',
      status: 400,
      detail,
      ...(instance && { instance }),
    },
    400,
  )

/**
 * 403 Forbidden エラーレスポンス
 */
export const forbiddenResponse = (c: Context, detail = 'アクセスが拒否されました', instance?: string) =>
  c.json(
    {
      type: 'about:blank/forbidden',
      title: 'Forbidden',
      status: 403,
      detail,
      ...(instance && { instance }),
    },
    403,
  )

/**
 * 404 Not Found エラーレスポンス
 */
export const notFoundResponse = (c: Context, detail = 'リソースが見つかりません', instance?: string) =>
  c.json(
    {
      type: 'about:blank/not-found',
      title: 'Not Found',
      status: 404,
      detail,
      ...(instance && { instance }),
    },
    404,
  )

/**
 * 409 Conflict エラーレスポンス
 */
export const conflictResponse = (c: Context, detail: string, instance?: string) =>
  c.json(
    {
      type: 'about:blank/conflict',
      title: 'Conflict',
      status: 409,
      detail,
      ...(instance && { instance }),
    },
    409,
  )

/**
 * 500 Internal Server Error エラーレスポンス
 */
export const internalServerErrorResponse = (
  c: Context,
  detail = 'サーバー内部エラーが発生しました',
  instance?: string,
) =>
  c.json(
    {
      type: 'about:blank/internal-server-error',
      title: 'Internal Server Error',
      status: 500,
      detail,
      ...(instance && { instance }),
    },
    500,
  )
