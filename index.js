var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send("HELLO");
});

app.post('/', (function(req, res) {
    res.send("POST");
}));

app.post('/upload', (function(req, res) {
    var temperature = req.param('temperature');
    var humidity = req.param('humidity');
    var mq2 = req.param('mq2');
    var mq7 = req.param('mq7');
    var mq135 = req.param('mq135');
    var sound = req.param('sound');



    res.send(temperature + ' ' + humidity + ' ' + mq2 + ' ' + mq7 + ' ' + mq135 + ' ' + sound);
}));

app.listen(80, function() {
    console.log("Started on Port 80");
});