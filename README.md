# voiceflow-line

Voiceflow SDKを使った、LINE BOTのサンプルです。

## Usage

```
git clone https://github.com/kun432/voiceflow-line.git
cd voiceflow-line
npm install

// LINE Messaging API SDKのチャネルアクセストークンと
// チャネルシークレットを環境変数で設定
export CHANNEL_ACCESS_TOKEN="XXXXX...XXXXX"
export CHANNEL_SECRET="XXXXX...XXXXX"
export PORT=1234

// Voiceflow SDKのバージョンIDとAPIキーを環境変数で設定
export VF_VERSION_ID="XXXXX...XXXXX"
export VF_API_KEY="VF.XXXXX...XXXXX"

// ngrokで公開
ngrok http 1234
```

ngrokで生成されたURL + "/callback" をLINE Messaging APIのWebhookに指定すればOK

※Messaging APIの設定はよしなに・・・
