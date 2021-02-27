var express = require('express');
var User = require('../models/User');

var router = express.Router();


// Create new User
router.post('/create', async (req, res) => {

    var user = new User({
        username : req.body.username,
        password : req.body.password,
        machineList : req.body.machineList
    });

    try{
        createdUser = await user.save();

        // Filter
        var filteredCreatedUser = {};
        filteredCreatedUser._id = createdUser._id;
        filteredCreatedUser.machineList = createdUser.machineList;

        // console.log(filteredCreatedUser);
        req.session.loginStatus = true;
        req.session.loginInfo = filteredCreatedUser;
        
        res.json(filteredCreatedUser);

    } catch(err) {
        res.json({ message: err });
    }
});


// User Login
router.post('/login', async (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    try{
        var userInfo = await User.findOne({ username: username, password: password }).exec();

        // Filter
        var filteredUserInfo = {};
        filteredUserInfo._id = userInfo._id;
        filteredUserInfo.machineList = userInfo.machineList;

        // console.log(filteredUserInfo);
        req.session.loginStatus = true;
        req.session.loginInfo = filteredUserInfo;
        
        res.json(filteredUserInfo);

    } catch(err) {
        res.json({ message: err });
    }
});


// User Logout
router.get('/logout', async (req, res) => {

    try{
        req.session.destroy();
        res.send("1");

    } catch(err) {
        res.json({ message: err });
    }
});


module.exports = router;