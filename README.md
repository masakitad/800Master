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

## ライセンス
個人利用・学習目的での使用を想定しています。
