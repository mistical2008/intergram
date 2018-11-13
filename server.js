const request = require('request');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/message.db');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config');
const SITENAME = config.SITENAME;

// ===============
const database = require('./db/message.db');
const TgMessage = require('./db/message.model');

database().then(info => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
})
// ==============

app.use(express.static('dist', {index: 'demo.html', maxage: '4h'}));
app.use(bodyParser.json());

// handle admin Telegram messages
app.post('/hook', function(req, res){
    try {
        const message = req.body.message || req.body.channel_post;
        const chatId = message.chat.id;
        const name = message.chat.first_name || message.chat.title || "admin";
        const text = message.text || "";
        const reply = message.reply_to_message;

        if (text.startsWith("/start")) {
            console.log("/start chatId " + chatId);
            sendTelegramMessage(chatId,
                "*Welcome to Intergram* \n" +
                "Your unique chat id is `" + chatId + "`\n" +
                "Use it to link between the embedded chat and this telegram chat",
                "Markdown");
        } else if (reply) {
            let replyText = reply.text || "";
            let userId = replyText.split(':')[0];
            io.emit(chatId + "-" + userId, {name, text, from: 'admin'});
        } else if (text){
            io.emit(chatId, {name, text, from: 'admin'});
        }

    } catch (e) {
        console.error("hook error", e, req.body);
    }
    res.statusCode = 200;
    res.end();
});

// handle chat visitors websocket messages
io.on('connection', function(client){

    client.on('register', function(registerMsg){
        let userId = registerMsg.userId;
        let chatId = registerMsg.chatId;
        let widgetDomain;
        let messageReceived = false;
        console.log("useId " + userId + " connected to chatId " + chatId);

        client.on('message', function(msg) {
            messageReceived = true;
            io.emit(chatId + "-" + userId, msg);
            let visitorName = msg.visitorName ? "[" + msg.visitorName + "]: " : "";
            sendTelegramMessage(chatId, userId + ":" + visitorName + SITENAME + " " + msg.text); // SITENAME INJECTION
            TgMessage.create({
                "user": "test",
                "message": "test2"
            }).then(message => console.log(message._id));
            console.log('registerMsg:' + registerMsg);


        });

        client.on('disconnect', function(){
            if (messageReceived) {
                sendTelegramMessage(chatId, userId + SITENAME + " Вышел из чата");
            }
        });
    });

});

function sendTelegramMessage(chatId, text, parseMode) {
    request
        .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .form({
            "chat_id": chatId,
            "text": text,
            "parse_mode": parseMode,
            "reply_markup": JSON.stringify({
                inline_keyboard: [
                  [{ text: 'Ответить ✍️', callback_data: "reply_to_message"}]
                ]
            })
        });
}

app.post('/usage-start', cors(), function(req, res) {
    console.log('usage from', req.query.host);
    res.statusCode = 200;
    res.end();
});

// left here until the cache expires
app.post('/usage-end', cors(), function(req, res) {
    res.statusCode = 200;
    res.end();
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get("/.well-known/acme-challenge/:content", (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
