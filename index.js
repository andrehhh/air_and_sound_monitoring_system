require('dotenv').config();
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var env = process.env;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    // genid: function(req) {
    //   return genuuid(); // use UUIDs for session IDs
    // },
    secret: 'keyboard cat'
}));


var templates_dir = path.join(__dirname, '/templates');

// Mongoose
mongoose.connect(env.DB_URL, () => console.log("Connected to DB"));


// Home Route
app.get('/', (req, res) => {

    res.sendFile(path.join(templates_dir, 'index.html'));
});


// Dashboard Route
app.get('/dashboard', (req, res) => {
    if(req.session.loginStatus) {
        res.sendFile(path.join(templates_dir, 'dashboard.html'));
    } else {
        res.redirect('/');
    }
    
});


// API Route
var apiRoute = require('./api');
app.use('/api', apiRoute);


// Machine Template
app.get('/templates/machine', (req, res) => {
    res.sendFile(path.join(templates_dir, 'machine.html'));
})


app.listen(80, function() {
    console.log("Started on Port 80");
});