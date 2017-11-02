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
    console.log(req.body);
    for (var event of req.body.events){
        if (event.type == 'message' && event.message.text == 'ハロー'){
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
            }
            var body = {
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: 'こんにちは'
                }]
            }
            var url = 'https://api.line.me/v2/bot/message/reply';
            request({
                url: url,
                method: 'POST',
                headers: headers,
                body: body,
                json: true
            });
        }
    }
});
