var express = require('express');

var router = express.Router();


router.get('/', (req, res) => {
    res.send("On API Route");
});


// Machine
var machineRoute = require('./apiRoutes/machine');
router.use('/machine', machineRoute);


// User
var userRoute = require('./apiRoutes/user');
router.use('/user', userRoute);

module.exports = router;