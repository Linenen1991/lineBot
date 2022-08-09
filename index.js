'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "rc2ky7X5QK39R2RblaiRiEqqInME7FIsG55lu7k+CjfqL/JEYkx9rnokDIl+58YNtSgm33KBjxO6iKtTLpvwsYGYlyV1R8hPVCULX+rQACm7vf9c8TfAnZ0Svu/6hPLFKN9/40OqTVraFIZ7aD8wgQdB04t89/1O/w1cDnyilFU=",
  channelSecret": "5dae8eae26bff119024319e076797f06"
};

// create LINE SDK client
const client = new line.Client(config);

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
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
