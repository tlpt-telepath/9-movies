# #MyBest9Movie

TMDB APIを使って「好きな映画9選」を3x3で作る静的Webアプリです。

## 機能
- ページタイトル編集（デフォルト: `#MyBest9Movie`）
- 各セルで映画検索（`language=ja-JP` 優先、必要に応じて `en-US` フォールバック）
- ポスター付き3x3プレビュー
- 選択解除・差し替え
- シェア文コピー
- localStorage復元

## 環境変数
`.env.local` を作成してどちらかを設定してください。

```bash
NEXT_PUBLIC_TMDB_READ_TOKEN=your_tmdb_read_access_token
# または
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

> [!WARNING]
> GitHub Pages配信では、`NEXT_PUBLIC_` 環境変数はクライアントに露出します。TMDBキー/トークンは公開される前提で扱ってください。

## ローカル起動
```bash
npm install
npm run dev
```

## 静的ビルド
```bash
npm run build
```
`out/` が生成されます。

## GitHub Pages 公開
このリポジトリ名に応じた `basePath` を自動設定するため、Actions では次の環境変数を渡します。

- `GITHUB_PAGES=true`
- `GITHUB_REPOSITORY=<owner>/<repo>`（GitHub Actionsでは自動設定）

例（手動ビルド）:
```bash
GITHUB_PAGES=true GITHUB_REPOSITORY=tlpt-telepath/9-animes npm run build
```

`out/` を Pages にデプロイしてください。

## TMDB attribution
This product uses the TMDB API but is not endorsed or certified by TMDB.
