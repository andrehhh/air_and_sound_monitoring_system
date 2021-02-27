require('dotenv').config();
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment-timezone');
var session = require('express-session');

var env = process.env;

var app = express();

app.use(session({
    secret : 'keyboard cat', 
    resave : false, 
    saveUninitialized : true 
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var templates_dir = path.join(__dirname, '/templates');

// MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://" + env.DB_USER + ":" + env.DB_PASS + "@" + env.DB_HOST + ":" + env.DB_PORT + "/" + env.DB_NAME;


/////////////////
// GET Methods //
/////////////////

app.get('/', function(req, res) {
    res.send("HELLO");
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(templates_dir, 'dashboard.html'));
});

app.get('/api/machine/upload', (function(req, res) {
    var machine_id = req.param('machine_id');
    var temperature = req.param('temperature');
    var humidity = req.param('humidity');
    var mq2 = req.param('mq2');
    var mq7 = req.param('mq7');
    var mq135 = req.param('mq135');
    var sound = req.param('sound');

    var insert_status = "0";

    if(machine_id != null && temperature != null && humidity != null && mq2 != null && mq7 != null && mq135 != null && sound != null) {

        // Connect to MongoDB
        MongoClient.connect(url, function(err, db) {
            if (err) {
                throw err;

            } else {
                var time_added = getCurrentTime();

                var data = {
                    machine_id: machine_id,
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
                        insert_id = data._id;
                        console.log("Insert success - " + insert_id);
                    }
                    db.close();
                });
            }
        });
    }
    setTimeout((function() {res.send(insert_status);}), 500);
}));


//////////////////
// POST Methods //
//////////////////


// Create Account
app.post('/api/user/create', function(req, res) {

    var data = {
        username: req.body.username,
        password: req.body.password,
        machine_id: req.body.machine_list
    };

    // Connect to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.send("0");

        } else {
            var dbo = db.db("monitoring_system");
            dbo.collection("users").insertOne(data, function (err, result) {
                if(err) res.send("0");
                else res.send("1");
                db.close();
            });
        }
    });
});


// Get Machine Data
app.post('/api/machine/get', function(req, res) {
    var data = req.body;
    var machine_id = data.machine_id;
    
    if(machine_id) {

        // Connect to MongoDB
        MongoClient.connect(url, function(err, db) {

            if (err) {
                res.send("0");

            } else {

                var dbo = db.db("monitoring_system");
                var query = {machine_id : machine_id};

                dbo.collection("insert_log").find(query).toArray(function(err, result1) {
                    if(err) res.send("0");
                    else {
                        var arr = result1;
                        console.log(arr);

                        dbo.collection("insert_log").find(query).toArray(function(err, result2) {
                            if(err) res.send("0");
                            else {
                                var count = 0;
                                result2.forEach(function(row) {
                                    arr[count].data = row;
                                    count++;
                                });
                                res.send(arr);
                            }
                        });
                    }
                    db.close();
                });
            }
        });

    } else {
        res.send("0");
    }
});


app.listen(80, function() {
    console.log("Started on Port 80");
});

function getCurrentTime() {
    return moment().tz("Asia/Singapore").format("DD-MM-YYYY HH:mm:ss");
}