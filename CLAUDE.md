# Dungeon Explorer - プロジェクト引き継ぎ資料

## プロジェクト概要

放置型ダンジョン探索ゲーム。GitHub Pages でホスト（バックエンドなし）。
2024年に一度頓挫し、2026年4月に再始動。

**公開URL**: https://tneko13.github.io/dungeon-explorer/
**リポジトリ**: https://github.com/tneko13/dungeon-explorer

---

## 技術スタック

| | |
|---|---|
| Vite 6 + React 18 + TypeScript 5 | ビルド・UI |
| Zustand 5 + persist | 状態管理・localStorageセーブ |
| GitHub Actions | mainプッシュで自動デプロイ |

```
npm run dev      # 開発サーバー起動
npm run build    # ビルド
```

---

## ディレクトリ構成

```
src/
├── types/index.ts           # 全型定義（GameState等）
├── store/gameStore.ts       # Zustand store（localStorage永続化）
├── game/
│   ├── engine/TimeEngine.ts # オフライン時間計算
│   ├── dungeon/DungeonData.ts
│   └── party/CharacterData.ts
├── App.tsx                  # 現在はプレースホルダー
└── main.tsx
```

---

## 確定済みゲーム仕様

| 項目 | 内容 |
|---|---|
| ジャンル | 放置型ダンジョン探索 + デッキ構築 |
| 進行 | リアルタイム放置（ブラウザ閉じても進行） |
| パーティ | キャラクター選択 + スキルカード装備の両立 |
| 介入（出発前） | 方針設定（宝箱全開け・罠スルー・クリア優先など） |
| 介入（戦闘中） | 任意の回復・必殺技使用（進行はブロックしない） |
| 表示 | 数値・テキストベース（グラフィックなし） |
| 保存 | localStorage |
| ホスト | GitHub Pages |

---

## 確定済み追加仕様（2026-04-16決定）

1. **キャラクターの成長・強化**
   - レベルアップで自動強化（HP・ATKなどのステータス上昇）
   - 装備ドロップで追加強化（ダンジョンから装備を収集）

2. **スキルの習得**
   - スキルカード方式ではなく、職業ごとにレベルアップで自動習得

3. **探索時間**
   - 1階層 = 1分（5階ダンジョンなら5分で完了）

---

## 作業ルール（Claude へのルール）

### ファイル編集（エンコーディング保護）

- **ソースコードの編集には必ず `replace_string_in_file` / `create_file` ツールを使う**
- PowerShell の `Set-Content` / `Out-File` でソースファイルを書き換えてはならない  
  （デフォルトエンコーディングが UTF-8 でないため日本語が化ける）
- ターミナルコマンドでファイルを直接書き換えるのは、ユーザーが明示的に要求した場合のみ

### 仕様策定ルール

- ゲーム仕様はすべて `docs/spec.md` で一元管理する
- 会話の中で仕様が決定したら、**その場で必ず `docs/spec.md` に書き込む**
- 未確定の項目は `docs/spec.md` の「未確定」セクションに残す
- 実装はかならず `docs/spec.md` の確定仕様に基づいて行う

---

## Git / デプロイ

- リモート: `https://github.com/tneko13/dungeon-explorer.git`
- 認証: PAT が `.git/config` の remote URL に埋め込まれている（ローカルのみ）
- デプロイ: main に push → GitHub Actions が自動実行

---

## 注意事項

- `.claude/settings.local.json` に `Bash(*)` の自動許可が設定済み
- `node_modules` は git 管理外（`.gitignore` 済み）

