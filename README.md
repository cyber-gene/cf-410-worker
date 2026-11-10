# 410 Gone Worker

すべてのパス・HTTPメソッドに `410 Gone` を返すCloudflare Workerです。サービス終了の案内に利用できます。
オリジンサーバーにはアクセスせず、本文に `Gone` を返します（HEADの本文は空）。レスポンスは `Cache-Control: no-store` を指定しています。

## 適用手順

CloudflareのWeb UIからデプロイできます。ローカルへのNode.jsやnpmのインストールは不要です。

- このリポジトリを自分のGitHubアカウントにForkします。
- Cloudflareダッシュボードの **Workers & Pages → Create application** からGitリポジトリのインポートを選び、GitHubを連携してForkしたリポジトリを選択します。
- Worker名を `cf-410-worker`、ルートディレクトリをリポジトリ直下、ビルドコマンドを空欄、デプロイコマンドを `npx wrangler deploy` にしてデプロイします。Worker名は `wrangler.jsonc` の `name` と一致させます。
- 表示された `workers.dev` URLで、本文が `Gone`、HTTPステータスが `410 Gone` になることを確認します。HTTPステータスはブラウザの開発者ツールのNetworkタブで確認できます。

### 既存サイトへの適用

- 既存サイトに適用する場合は、対象ドメインをCloudflareで管理し、対象ホストのDNSレコードを **Proxied（オレンジ色の雲）** にします。変更前の設定は控えておきます。
- CloudflareダッシュボードでデプロイしたWorkerを開き、**Settings → Domains & Routes** からRouteを追加します。対象ゾーンを選び、`example.com/*` を登録します。`www.example.com/*` なども必要に応じて追加します。
- `curl -i https://example.com/any/path` などで適用後の応答を確認します。

Routeはダッシュボードで管理します。より具体的なWorker Routeや、リダイレクト・Access・WAFなどの既存ルールがある場合は、対象URLへの適用状況も確認してください。

## メッセージの変更方法

- `src/index.js` の `message` を変更します。改行もそのまま本文に反映されます。

  ```js
  const message = `このサービスは終了しました。
  ご利用ありがとうございました。`;
  ```

- GitHub上で編集する場合は、Forkしたリポジトリのデプロイ対象ブランチに変更をコミットします。Cloudflareが自動で再デプロイします。
- デプロイ完了後、対象URLで表示内容を確認します。

## ローカルで確認・デプロイする場合

- Node.js 22以降とnpmを用意し、リポジトリを取得します。
- リポジトリ内で `npm install` を実行します。
- `npm test` でテストし、`npm run dev` でローカルの表示を確認します。
- `npx wrangler login` でCloudflareにログインします。
- `npm run check` で設定を確認し、`npm run deploy` で反映します。

## 適用の解除

- 追加したRouteを削除し、元のサイトの応答を確認します。
- DNSをDNS onlyからProxiedに変更していた場合は、必要に応じて元の設定に戻します。

DNSの向き先もWorkerへ変更する場合は、[Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)を利用してください。既存DNSレコードの値・TTL・プロキシ設定を保存してから切り替えます。

詳しくは[Web UIでのデプロイ](https://developers.cloudflare.com/workers/get-started/dashboard/)、[ビルド設定](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)、[Workers Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)を参照してください。

## ライセンス

[MIT License](LICENSE)
