'use strict';

const line = require('@line/bot-sdk');
const { default: RuntimeClientFactory, TraceType } = require("@voiceflow/runtime-client-js");
const express = require('express');

// create config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const vfconfig = {
  versionID: process.env.VF_VERSION_ID,
  apiKey: process.env.VF_API_KEY,
};

// mock database
const mockDatabase = {};
const db = {
    read: async (userID) => mockDatabase[userID],
    insert: async (userID, state) => mockDatabase[userID] = state,
    delete: async (userID) => delete mockDatabase[userID]
};

// create LINE SDK client
const client = new line.Client(config);

// create VF SDK client
const runtimeClientFactory = new RuntimeClientFactory(vfconfig);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  const userInput = event.message.text;

  const state = await db.read(userId);

  const vfclient = runtimeClientFactory.createClient(state); 
  const context = await vfclient.sendText(userInput)

  console.log("===== REQ ===== \n" + JSON.stringify(event, null, 2));

  if (context.isEnding()) {
      db.delete(userId);
  } else {
      await db.insert(userId, context.toJSON().state);
  }

  // use reply API
  console.log("===== CONTEXT from VF ===== \n" + JSON.stringify(context.getTrace(), null, 2));

  let replyMessages = [];
  for (const trace of context.getTrace()){
    if (trace.type === TraceType.SPEAK) {
      replyMessages.push({
        type: 'text',
        text: trace.payload.message
      });
    }
    if (trace.type === TraceType.VISUAL && trace.payload.visualType === 'image') {
      replyMessages.push({
        type: 'image',
        originalContentUrl: trace.payload.image,
        previewImageUrl: trace.payload.image
      });
    }
    if (trace.type === TraceType.AUDIO) {
      replyMessages.push({
        type: 'audio',
        originalContentUrl: trace.payload.src,
        duration: 12000 // need to know the duration of audio in advanced...
      });
    }
  }

  //const answer = { type: 'text', text: 
  //  context.getTrace()
  //  .filter(({ type }) => type === TraceType.SPEAK)
  //  .map(({ payload })=> payload.message)
  //  .join("") };

  console.log("===== RES ===== \n" + JSON.stringify(replyMessages, null, 2));

  return client.replyMessage(event.replyToken, replyMessages);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
