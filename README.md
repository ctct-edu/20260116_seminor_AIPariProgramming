# Cloudflare Fullstack Template

Hono + React + Cloudflare Workers/Pages のフルスタックテンプレートです。

## 技術スタック

### Backend

- [Hono](https://hono.dev/) - 軽量 Web フレームワーク
- [Cloudflare Workers](https://workers.cloudflare.com/) - エッジコンピューティング
- [Drizzle ORM](https://orm.drizzle.team/) + Cloudflare D1 - データベース
- [Clerk](https://clerk.com/) - 認証

### Frontend

- [React 19](https://react.dev/)
- [TanStack Router](https://tanstack.com/router) - ファイルベースルーティング
- [TanStack Query](https://tanstack.com/query) - データフェッチング
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Clerk](https://clerk.com/) - 認証

### Tooling

- [Bun](https://bun.sh/) - パッケージマネージャー & ランタイム
- [Biome](https://biomejs.dev/) - Linter & Formatter
- [Vitest](https://vitest.dev/) - ユニットテスト
- [Playwright](https://playwright.dev/) - E2E テスト
- [Zod v4](https://zod.dev/) - スキーマバリデーション

## ディレクトリ構造

```txt
├── apps/
│   ├── client/                 # React フロントエンド
│   │   └── src/
│   │       ├── api/            # Hono RPC クライアント
│   │       ├── hooks/          # React Query カスタムフック
│   │       ├── lib/            # ユーティリティ
│   │       └── routes/         # ファイルベースルーティング
│   └── server/                 # Hono API サーバー
│       └── src/
│           ├── handlers/       # ルートハンドラー実装
│           ├── routes/         # OpenAPI ルート定義
│           ├── middlewares/    # ミドルウェア
│           └── utils/          # ユーティリティ
├── packages/
│   └── db/                     # Drizzle スキーマ & DB 接続
│       └── schemas/            # テーブル定義
├── tests/                      # Vitest ユニットテスト
├── e2e/                        # Playwright E2E テスト
└── package.json                # Bun Workspace 設定
```

## Getting Started

### 1. 依存関係のインストール

```sh
bun install
```

### 2. 環境変数の設定

```sh
# サーバー
cp apps/server/.dev.vars.example apps/server/.dev.vars

# クライアント
cp apps/client/.env.example apps/client/.env
```

[Clerk Dashboard](https://dashboard.clerk.com/) でアプリケーションを作成し、キーを設定してください。

### 3. データベースのセットアップ

```sh
# D1 データベースを作成
cd apps/server
wrangler d1 create my-database

# wrangler.jsonc の database_id を更新

# マイグレーション生成 & 適用
cd packages/db
bun run generate
bun run migrate
```

### 4. 開発サーバーの起動

```sh
# ターミナル 1: API サーバー
bun run server

# ターミナル 2: フロントエンド
bun run dev
```

- Client: <http://localhost:5173>
- Server: <http://localhost:8787>
- Swagger UI: <http://localhost:8787/docs>

## Scripts

### ルートディレクトリ

```sh
bun run dev          # 全ワークスペースの開発サーバー起動
bun run typecheck    # 全ワークスペースの型チェック
```

### テスト

```sh
bun run test         # Vitest ウォッチモード
bun run test:run     # Vitest 1回実行
bun run test:coverage # Vitest カバレッジレポート
bun run test:e2e     # Playwright E2E テスト
bun run test:e2e:ui  # Playwright UI モード
```

### Biome (Linter & Formatter)

```sh
bunx biome check .              # Lint チェック
bunx biome check . --write      # Lint + 自動修正
bunx biome format .             # フォーマットチェック
bunx biome format . --write     # フォーマット適用
```

### データベース (packages/db)

```sh
bun run generate        # マイグレーションファイル生成
bun run migrate         # ローカル D1 にマイグレーション適用
bun run migrate:remote  # リモート D1 にマイグレーション適用
bun run studio          # Drizzle Studio 起動
```

## Environment Variables

### Server (`apps/server/.dev.vars`)

| 変数名                  | 説明                   | 例                               |
| ----------------------- | ---------------------- | -------------------------------- |
| `ENVIRONMENT`           | 実行環境               | `local`, `staging`, `production` |
| `CLERK_PUBLISHABLE_KEY` | Clerk 公開キー         | `pk_test_xxx`                    |
| `CLERK_SECRET_KEY`      | Clerk シークレットキー | `sk_test_xxx`                    |

### Client (`apps/client/.env`)

| 変数名                       | 説明               | 例                      |
| ---------------------------- | ------------------ | ----------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk 公開キー     | `pk_test_xxx`           |
| `VITE_API_URL`               | API サーバーの URL | `http://localhost:8787` |

### 環境変数バリデーション

環境変数は Zod v4 でバリデーションされます。

**クライアント** (`apps/client/src/config.tsx`):

```ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().optional().default(''),
  VITE_API_URL: z.url().optional().default('http://localhost:8787'),
})

const env = envSchema.parse(import.meta.env)
```

**サーバー** (`packages/db/index.ts`):

```ts
import { z } from 'zod'

export const envSchema = z.object({
  DB: z.custom<D1Database>(...),
  ENVIRONMENT: z.enum(['local', 'staging', 'production']).optional().default('local'),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
})

export type Bindings = z.infer<typeof envSchema>
```

## API Endpoints

| Method | Path      | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | ヘルスチェック   |
| GET    | `/me`     | 認証ユーザー情報 |
| GET    | `/docs`   | Swagger UI       |

## Hono RPC Client

このテンプレートでは、Hono RPC を使用して型安全な API クライアントを提供しています。

### サーバー側の型エクスポート

```ts
// apps/server/src/index.tsx
const app = new OpenAPIHono<{ Bindings: Bindings }>().route('/health', healthRoute).route('/me', meRoute);

export type AppType = typeof app;
```

### クライアント側での利用

```ts
// apps/client/src/api/client.ts
import { hc } from 'hono/client';
import type { AppType } from '@xenoculis-monorepo/server';

export const client = hc<AppType>(import.meta.env.VITE_API_URL);
```

### API 呼び出し例

```ts
// 型安全な API 呼び出し
const res = await client.health.$get();
const data = await res.json();
// data は { data: { status: "ok" } } として型推論される

// React Query と組み合わせ
const { data, isLoading } = useQuery({
  queryKey: ['health'],
  queryFn: async () => {
    const res = await client.health.$get();
    return res.json();
  },
});
```

## Deploy

### API (Cloudflare Workers)

```sh
cd apps/server
bun run deploy
```

### Client (Cloudflare Pages)

```sh
cd apps/client
bun run deploy
```

### Production Secrets

本番環境では、Cloudflare Workers の Secrets を使用して機密情報を設定します。

```sh
cd apps/server

# Clerk シークレットキーを設定
wrangler secret put CLERK_SECRET_KEY
# プロンプトが表示されたら値を入力

# 環境を指定する場合
wrangler secret put CLERK_SECRET_KEY --env production
```

## Customization

### パッケージ名の変更

`@xenoculis-monorepo/` プレフィックスを変更する場合:

1. `package.json` (root, apps/\*, packages/\*)
2. `tsconfig.base.json` のパスマッピング
3. 各ファイルの import 文

### スキーマの追加

`packages/db/schemas/` に新しいテーブルを追加:

```ts
// packages/db/schemas/posts.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
});
```

その後、マイグレーションを生成・適用してください。

### 新しい API エンドポイントの追加

1. **ルート定義** (`apps/server/src/routes/`)

```ts
// apps/server/src/routes/posts.ts
import { createRoute } from '@hono/zod-openapi'
import { z } from 'zod'

export const getPostsRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ posts: z.array(...) }) } },
      description: 'List of posts',
    },
  },
})
```

1. **ハンドラー実装** (`apps/server/src/handlers/`)

```ts
// apps/server/src/handlers/posts.ts
import type { RouteHandler } from '@hono/zod-openapi';
import type { getPostsRoute } from '../routes/posts';

export const getPostsHandler: RouteHandler<typeof getPostsRoute> = async (c) => {
  // 実装
};
```

1. **ルート登録** (`apps/server/src/index.tsx`)

```ts
import { postsRoute } from './routes/posts';
app.route('/posts', postsRoute);
```

## Testing

### ユニットテスト (Vitest)

`tests/` ディレクトリにテストファイルを配置します。

```ts
// tests/example.test.ts
import { describe, expect, it } from 'vitest'

describe('Example', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })
})
```

```sh
bun run test         # ウォッチモード
bun run test:run     # 1回実行
bun run test:coverage # カバレッジレポート
```

### E2E テスト (Playwright)

`e2e/` ディレクトリにテストファイルを配置します。

```ts
// e2e/home.spec.ts
import { expect, test } from '@playwright/test'

test('should load home page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.*/)
})
```

```sh
bun run test:e2e     # E2E テスト実行
bun run test:e2e:ui  # UI モード（デバッグ用）
```

## Troubleshooting

### `wrangler` コマンドが見つからない

```sh
bun add -g wrangler
# または
bunx wrangler <command>
```

### D1 データベースに接続できない

1. `wrangler.jsonc` の `database_id` が正しいか確認
2. ローカル開発時は `wrangler dev --local` を使用

### 型エラー: `@xenoculis-monorepo/*` が見つからない

```sh
# 依存関係を再インストール
bun install

# TypeScript のキャッシュをクリア
rm -rf node_modules/.cache
```

### CORS エラー

開発時は Vite のプロキシ設定 (`apps/client/vite.config.ts`) を確認してください。
本番環境では `apps/server/src/index.tsx` の CORS 設定を更新してください。

### Clerk 認証が動作しない

1. 環境変数が正しく設定されているか確認
2. Clerk Dashboard でドメインが許可されているか確認
3. ブラウザの開発者ツールでエラーメッセージを確認
