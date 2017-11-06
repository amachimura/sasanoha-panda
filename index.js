var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var scheduleService = require('./google/scheduleService.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var server = app.listen(process.env.PORT || 3000, function(){
    console.log("listening port:" + server.address().port);
});

app.post('/hook', (req, res) => {
    console.log(req.body.events[0].message.text);
    var message = 'hoge';
    if(req.body.events[0].message.text.indexOf('練習') != -1){
      scheduleService.getOurEvents((b) => {
        console.log(b);
        for(i=0; i < b.length; i++){
          console.log('schedule is :' + b[i]);
          message = message + b[i] + '¥n';
          console.log(message);
        }
      });
    };
    var options = {
      method: 'POST',
      uri: 'https://api.line.me/v2/bot/message/reply',
      body: {
        replyToken: req.body.events[0].replyToken,
        messages: [{
          type: 'text',
          text: message // ここに指定した文字列がボットの発言になる
        }]
      },
      auth: {
        bearer: 'A1j5wzdp9/zZFySROIOu+xRKYiwprNdoXV5EQNyvw1XJvnc1GFd19TTfZebfukKzmZ46IcD3gbUL8YcmjSoiRDOjmzXnDwAn1v+7IS18G2YYcwjOaHbTGGQfDaVNc4Fy+3OPzvcfyjynqmw4d4E6WAdB04t89/1O/w1cDnyilFU='
      },
      json: true
    }
    request(options, (err, response, body) => {
      console.log(JSON.stringify(response))
    });
    res.send('OK')
  });
