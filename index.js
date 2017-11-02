const LINE_CHANNEL_ACCESS_TOKEN = 'A1j5wzdp9/zZFySROIOu+xRKYiwprNdoXV5EQNyvw1XJvnc1GFd19TTfZebfukKzmZ46IcD3gbUL8YcmjSoiRDOjmzXnDwAn1v+7IS18G2YYcwjOaHbTGGQfDaVNc4Fy+3OPzvcfyjynqmw4d4E6WAdB04t89/1O/w1cDnyilFU=';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var server = app.listen(process.env.PORT || 3000, function(){
    console.log("listening port:" + server.address().port);
});

app.post('/hook', function(req, res, next){
    res.status(200).end();
    console.log(req);
    const options = {
      method: 'POST',
      uri: 'https://api.line.me/v2/bot/message/reply',
      body: {
        replyToken: req.body.events[0].replyToken,
        messages: [{
          type: 'text',
          text: req.body.events[0].message.text // ここに指定した文字列がボットの発言になる
        }]
      },
      auth: {
        bearer: LINE_CHANNEL_ACCESS_TOKEN; // ここは自分のtokenに書き換える
      },
      json: true
    }
    request(options, (err, response, body) => {
      console.log(JSON.stringify(response))
    });
    res.send('OK')
  });
