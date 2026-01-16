# GitHub Copilot Instructions

## プロジェクト概要

詳細は [README.md](./README.md) を参照してください。

Hono + React + Cloudflare Workers/Pages のフルスタックテンプレートです。

## 技術スタック

- **Backend**: Hono, Zod OpenAPI, Drizzle ORM, Clerk, Cloudflare Workers/D1
- **Frontend**: React 19, TanStack Router/Query, Tailwind CSS v4, Clerk
- **Tooling**: Bun, Biome, TypeScript

## ディレクトリ構造

```txt
apps/client/src/     - React フロントエンド
apps/server/src/     - Hono API サーバー
packages/db/         - Drizzle スキーマ & DB 接続
```

## よく使うコマンド

```sh
bun install                      # 依存関係インストール
bun run dev                      # 全体の開発サーバー起動
bun run typecheck                # 型チェック
bunx biome check . --write       # Lint + 自動修正
```

## コーディング規約

- Biome でフォーマット・Lint を統一 (`biome.jsonc` 参照)
- シングルクォート、セミコロン省略
- インデント: 2 スペース
- 行幅: 120 文字

## API 設計パターン

1. **ルート定義**: `apps/server/src/routes/` に Zod OpenAPI スキーマ
2. **ハンドラー**: `apps/server/src/handlers/` に実装
3. **登録**: `apps/server/src/index.tsx` でルート登録

## 重要な注意事項

- Hono RPC を使用した型安全な API クライアント
- 環境変数は `.dev.vars` (サーバー) と `.env` (クライアント) で管理
- D1 データベースは Drizzle ORM で操作
