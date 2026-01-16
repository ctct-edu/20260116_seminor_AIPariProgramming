import { readdirSync } from 'node:fs'
import type { Config } from 'drizzle-kit'

export function getLocalDbPath(): string {
  const LOCAL_DB_PATH = '../../apps/server/.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
  const files = readdirSync(LOCAL_DB_PATH)
  const dbFile = files.find((f) => f.endsWith('.sqlite'))

  if (dbFile === undefined) {
    throw new Error('開発環境用の SQLite ファイルが見つかりません。`bun migration` を実行してください。')
  }

  return `${LOCAL_DB_PATH}/${dbFile}`
}

export default {
  dialect: 'sqlite',
  schema: './schemas/index.ts',
  out: './drizzle',
  dbCredentials: { url: getLocalDbPath() },
} satisfies Config
