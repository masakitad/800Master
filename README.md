# 800Master - 総合英会話・TOEIC学習アプリ

TOEIC 800点突破を目指す総合的な英語学習Webアプリです。

## 機能

### 学習機能
- **TOEIC Part 1-7 演習**: リスニング・リーディング各パートの問題演習
- **単語・熟語暗記**: フラッシュカード形式 + 間隔反復学習 (SRS)
- **シーン別フレーズ**: ビジネス・日常・旅行など8カテゴリ
- **AI英会話チャット**: OpenAI API連携 (キー設定時) または定型応答モード

### 進捗管理
- 学習日数・連続学習記録 (ストリーク)
- TOEIC推定スコアの推移グラフ
- Part別・分野別の正答率分析
- 週次・日次の学習時間集計
- 演習履歴の一覧表示

## 技術スタック
- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** によるスタイリング
- **Recharts** による進捗可視化
- **Firebase** (オプション、クラウド同期用)
- **localStorage** によるデータ永続化 (デフォルト)

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 環境変数 (オプション)

`.env.example` を `.env.local` にコピーして以下を設定:

### OpenAI API (AI英会話・翻訳機能)
```
OPENAI_API_KEY=sk-...
```
未設定の場合、定型応答モードで動作します。

### Firebase (複数端末同期)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
...
```
未設定の場合、localStorage のみで動作します (単一端末)。

## ディレクトリ構成
```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # ホーム/ダッシュボード
│   ├── toeic/        # TOEIC演習
│   ├── vocab/        # 単語学習
│   ├── phrases/      # フレーズ学習
│   ├── chat/         # AI英会話
│   ├── progress/     # 進捗管理
│   └── api/          # API Routes
├── components/       # 共通コンポーネント
├── data/             # 学習コンテンツ (問題・単語・フレーズ)
└── lib/              # 型定義・ストレージ・Firebase
```

## Railway へのデプロイ

このリポジトリは Railway 用に設定済みです (`railway.json`, `.nvmrc`, GitHub Actions CI)。

### 初回セットアップ
1. [Railway](https://railway.com) でアカウント作成
2. **New Project** → **Deploy from GitHub repo** → `masakitad/800Master` を選択
3. Railway が自動で Nixpacks を使い Next.js を検出してビルド
4. **Settings → Networking → Generate Domain** で公開URLを発行
5. 必要に応じて **Variables** タブで環境変数を設定:
   - `OPENAI_API_KEY` — AI英会話・翻訳機能用 (任意)
   - `NEXT_PUBLIC_FIREBASE_*` — クラウド同期用 (任意)

### main マージで自動デプロイ
Railway は GitHub 連携で `main` ブランチの変更を自動検知します:
1. `main` 以外で機能ブランチを作成して開発
2. PR を作成 → GitHub Actions の CI (ビルド検証) が走る
3. PR を `main` にマージ
4. Railway が main の更新を検知 → 自動で本番デプロイ

設定で「Deploy on push to main」「PR Preview Environments」を有効にすると、
PR ごとにプレビューURLも自動生成されます。

### 設定ファイル
- `railway.json`: Railway の build/deploy 設定 (Nixpacks、`npm start`、ヘルスチェック)
- `.nvmrc`: Node.js バージョン (20)
- `.github/workflows/ci.yml`: PR時に build verification を実行

## TOEIC Part 1 用画像の一括生成

OpenAI の画像生成APIを使い、Part 1 全問題の写真を一括で生成して
`public/images/toeic/` にバンドルできます。

### 使い方

```bash
# 環境変数を設定 (.env.local に書いても良い)
export OPENAI_API_KEY=sk-...

# 全Part1問題の写真を生成 (約8枚、$0.04/枚程度)
npm run gen:part1-images

# オプション
node scripts/generate-part1-images.mjs --force         # 既存ファイルを上書き
node scripts/generate-part1-images.mjs --part p1-3     # 特定問題のみ生成
node scripts/generate-part1-images.mjs --size 1024x1024 # サイズ指定
```

生成された PNG を `git add` してコミットすれば、デプロイ後はユーザーが
API キーなしで写真を見られます。アプリ側は `/images/toeic/p1-N.png` を
自動参照し、存在しない場合は UI 上の「AI生成」ボタンへフォールバックします。

## ライセンス
個人利用・学習目的での使用を想定しています。
