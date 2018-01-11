var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
// var fs = require('fs');
var app = express();
var scheduleService = require('./google/scheduleService.js');
const densukeUrl = "https://densuke.biz/list?cd=sQFkNy4e6fmhpmwY";
const portalUrl = "https://sites.google.com/site/sasanohaportal/home/practice";
const idToPost = "Ubdd6d86e0412809cc477c9adb6c0149f";

var options = {
  method: 'POST',
  uri: 'https://api.line.me/v2/bot/message/reply',
  body: {
    messages: [{
      type: 'text',
      text: '' // ここに指定した文字列がボットの発言になる
    }]
  },
  auth: {
    bearer: 'A1j5wzdp9/zZFySROIOu+xRKYiwprNdoXV5EQNyvw1XJvnc1GFd19TTfZebfukKzmZ46IcD3gbUL8YcmjSoiRDOjmzXnDwAn1v+7IS18G2YYcwjOaHbTGGQfDaVNc4Fy+3OPzvcfyjynqmw4d4E6WAdB04t89/1O/w1cDnyilFU='
  },
  json: true
};

var pushEndPoint = "https://api.line.me/v2/bot/message/push";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3000, function(){
    console.log("listening port:" + server.address().port);
});

app.post('/hook', (req, res) => {
    var userId = req.body.events[0].source.groupId || req.body.events[0].source.userId;
    console.log('userId: ' + userId);
    console.log(req.body.events[0].message.text);
    // if(req.body.events[0].type === "join") {
    //   fs.open("/files/contact", 'a+', function(file){
    //     fs.appendFile(file, userId);
    //   });
    // }
    options.body.replyToken = req.body.events[0].replyToken;
    if(req.body.events[0].message.text.indexOf('次の練習') != -1){
      scheduleService.getOurEvents((b) => {
        console.log(b);
        let message = "次の練習は\n\n"
        // for(i=0; i < b.length; i++){
        //   console.log('schedule is :' + b[i]);
        //   message = message + "・" +b[i] + "\n\n";
        //   console.log(message);
        // }
          console.log('schedule is :' + b[0]);
          message = message + "・" +b[0] + "\n\n";
          console.log(message);

        message = message + "だパンダ。 \n\n ================== \n 参加予定はこちらから入力してください：" + densukeUrl + "\n まとめサイトはこちら：" + portalUrl;
        options.body.messages[0]['text'] = message;
        request(options, (err, response, body) => {
          console.log('body: ' + JSON.stringify(body))
        });

      });
    };
    res.send('OK')
  });

  app.post('/pushThisWeek', (req, res) => {
      let message = "今週の練習は\n\n";
      console.log(req);
      console.log(req.body.event);
      let schedule = scheduleService.formatGoogleEvent(req.body.event);
      message = message + "・" + schedule + "\n\n だパンダ \n\n\n\n 参加予定変わった人はこちらから入力してください：" + densukeUrl + "\n まとめサイトはこちら：" + portalUrl;

      let optionsPost = Object.assign({}, options);
      optionsPost.uri = pushEndPoint;
      optionsPost.body.messages[0]['text'] = message;
      optionsPost.to = idToPost;
      request(optionsPost, (err, response, body) => {
        console.log('body: ' + JSON.stringify(body));
      });
      res.send('OK');
  });

  app.post('/pushTommorow', (req, res) => {
    console.log(req);
    res.send(req);
  });
