# 410 Gone Worker

すべてのパス・HTTPメソッドに `410 Gone` を返すCloudflare Workerです。
オリジンサーバーへの通信は行いません。HEADの本文は空、それ以外は日本語の案内文です。
`Cache-Control: no-store` を返します。サービス終了を案内し、`Retry-After` は返しません。
案内文を変更する場合は `src/index.js` を編集してください。

## ローカル確認とデプロイ

Node.js 22以降とnpmを使用します。

```sh
npm install
npm test
npm run dev
```

別のターミナルで応答を確認できます。

```sh
curl -i http://localhost:8787/any/path
curl -I http://localhost:8787/
curl -i -X POST http://localhost:8787/api/example
```

Cloudflareにログインしてデプロイします。

```sh
npx wrangler login
npm run check
npm run deploy
```

表示された `workers.dev` URLで410応答を確認してください。

## 既存サイトの切り替え（Workers Route）

既存サイトをサービス終了の案内に切り替えるには、既存DNSの向き先を変えず、リクエストをWorkerで処理するRouteが便利です。
オリジンが停止していても、このWorkerはオリジンにアクセスせず応答します。

1. 対象ホストの既存DNSレコードがCloudflareで **Proxied（オレンジ色の雲）** であることを確認します。DNS onlyの場合は元の設定を記録してからProxiedへ変更します。
2. CloudflareダッシュボードでデプロイしたWorkerを開き、Settings → Domains & RoutesからRouteを追加します。
3. 対象ゾーンを選び、例として `example.com/*` を登録します。`www.example.com/*` など別のホストも必要に応じて追加します。スキームを省略するとHTTP/HTTPSの両方に適用されます。
4. 対象URLを `curl -i https://example.com/any/path` などで確認します。既存のより具体的なWorker Routeがある場合は、そちらが優先されるため調整してください。

Routeはダッシュボードで管理する前提のため、`wrangler.jsonc` に `routes` は記載していません。
Cloudflareのリダイレクト・Access・WAF等で先に処理されるリクエストはWorkerまで到達しない場合があります。
全URLで410が必要なら、それらの既存ルールも確認してください。

復旧時は追加したRouteを削除し、元の応答を確認してください。DNS onlyから変更していた場合は、必要に応じて元の設定に戻します。

## DNSの向き先もWorkerへ変更する場合

Workerの **Custom Domain** を使用します。単純に既存レコードを `workers.dev` へのCNAMEにする方法は使用しません。
既存の同名A/AAAA/CNAMEレコードがある場合は競合するので、値・TTL・プロキシ設定を保存してから切り替えてください。
復旧時はCustom Domainを解除し、保存したDNSレコードを復元します。一時的な運用には上記Routeの方が戻しやすくなります。

公式ドキュメント:
- [Workers Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Wrangler設定](https://developers.cloudflare.com/workers/wrangler/configuration/)
