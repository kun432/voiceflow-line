# voiceflow-line

Voiceflow SDKを使った、LINE BOTのサンプルです。

demo for node.js/express server for running a LINE chatbot with Voiceflow SDK.

![](public/voiceflow.png)

<img src="https://github.com/kun432/voiceflow-line/raw/main/public/line.png" width=400 />

<img src="https://github.com/kun432/voiceflow-line/raw/main/public/line2.png" width=400 />

## Usage

```
git clone https://github.com/kun432/voiceflow-line.git
cd voiceflow-line
npm install
```

LINE Developerコンソール上でMessaging APIの設定を行い、チャネルアクセストークンとチャネルシークレットを取得、環境変数で設定

```
export CHANNEL_ACCESS_TOKEN="XXXXX...XXXXX"
export CHANNEL_SECRET="XXXXX...XXXXX"
export PORT=1234
```

coffeeshop.vfをVoiceflowでインポートし、Voiceflow SDK用のバージョンIDとAPIキーを取得、これも環境変数で設定しておく

```
export VF_VERSION_ID="XXXXX...XXXXX"
export VF_API_KEY="VF.XXXXX...XXXXX"
```

ローカルでアプリとngrokを起動

```
node .
ngrok http 1234
```

ngrokで生成されたURL + "/callback" をLINE Messaging APIのWebhookに指定すればOK
