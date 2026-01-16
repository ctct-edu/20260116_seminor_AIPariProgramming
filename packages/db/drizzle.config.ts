import type { Config } from 'drizzle-kit'

/**
 * @note wrangler で migration などを実行しているため、 dbCredentials は不要
 * @note drizzle-kit で migration などを実行する場合は、 dbCredentials を設定する
 */
export default {
  dialect: 'sqlite',
  schema: './schemas/index.ts',
  out: './drizzle',
  driver: 'd1-http',
  // dbCredentials: {
  //   accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  //   databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
  //   token: process.env.CLOUDFLARE_D1_TOKEN!,
  // },
} satisfies Config
