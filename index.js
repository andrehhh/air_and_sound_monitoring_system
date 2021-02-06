require('dotenv').config();
var express = require('express');
var app = express();

var env = process.env;

app.get('/', function(req, res) {
    res.send("HELLO");
});

app.get('/upload', (function(req, res) {
    var temperature = req.param('temperature');
    var humidity = req.param('humidity');
    var mq2 = req.param('mq2');
    var mq7 = req.param('mq7');
    var mq135 = req.param('mq135');
    var sound = req.param('sound');

    var insert_status = "0";

    if(temperature != null && humidity != null && mq2 != null && mq7 != null && mq135 != null && sound != null) {

        var moment = require('moment-timezone');
        var time_added = moment().tz("Asia/Singapore").format("DD-MM-YYYY HH:mm:ss");

        // Connect to MongoDB
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://" + env.DB_USER + ":" + env.DB_PASS + "@" + env.DB_HOST + ":" + env.DB_PORT + "/" + env.DB_NAME;

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            else {

                var data = {
                    temperature: temperature,
                    humidity: humidity,
                    mq2: mq2,
                    mq7: mq7,
                    mq135: mq135,
                    sound: sound,
                    time_added: time_added
                };

                var dbo = db.db("monitoring_system");
                dbo.collection("insert_log").insertOne(data, function (err, res) {
                    if (!err) {
                        insert_status = "1";
                    }
                    db.close();
                });
            }
        });
    }
    setTimeout((function() {res.send(insert_status);}), 500);
}));

app.listen(80, function() {
    console.log("Started on Port 80");
});