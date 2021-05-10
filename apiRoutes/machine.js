require('dotenv').config();
var express = require('express');
var MachineData = require('../models/MachineData');
var User = require('../models/User');

var router = express.Router();

// Upload Sensor Data
router.get('/upload', async (req, res) => {

    var sound;
    if(req.param("sound") == true) {
        sound = false;
    } else {
        sound = true;
    }

    var machineData = new MachineData({
        machineId : req.param("machineId"),
        temperature : req.param("temperature"),
        humidity : req.param("humidity"),
        lpg : req.param("lpg"),
        alcohol : req.param("alcohol"),
        co : req.param("co"),
        co2 : req.param("co2"),
        smoke : req.param("smoke"),
        sound : sound,
        time_added : new Date().toISOString()
    });

    var lastMachineData = await MachineData.find( { machineId: req.param("machineId") } ).sort({ _id : -1 }).limit(1).exec();
    lastMachineData = lastMachineData[0];

    var verificationCount = 0;
    if(machineData.machineId == lastMachineData.machineId) {
        verificationCount++;
    }
    if(machineData.temperature == lastMachineData.temperature) {
        verificationCount++;
    }
    if(machineData.humidity == lastMachineData.humidity) {
        verificationCount++;
    }
    if(machineData.lpg == lastMachineData.lpg) {
        verificationCount++;
    }
    if(machineData.alcohol == lastMachineData.alcohol) {
        verificationCount++;
    }
    if(machineData.co == lastMachineData.co) {
        verificationCount++;
    }
    if(machineData.co2 == lastMachineData.co2) {
        verificationCount++;
    }
    if(machineData.smoke == lastMachineData.smoke) {
        verificationCount++;
    }
    if(machineData.sound == lastMachineData.sound) {
        verificationCount++;
    }

    if(verificationCount < 9) {

        console.log("different!")

        try{
            uploadedData = await machineData.save();
            // console.log(uploadedData);
            res.json(uploadedData);
            

        } catch(err) {
            res.json({ message: err });
        }
    } else {
        console.log("same!")
    }

    // uploadedData = await machineData.save();
    
});

// Get Specific Machine Data
router.get('/get/:machineId', async (req, res) => {

    var machineData;

    try {
        if(req.session.machineData) { // Returns new record and save changes as session
            machineData = req.session.machineData;
            var lastIndex = objectCount(machineData) - 1;

            lastId = machineData[lastIndex]._id;

            var newMachineData = await MachineData.find( { machineId: req.params.machineId, _id : { $gt : lastId } } ).exec();
            req.session.machineData = machineData.concat(newMachineData);

            res.json(newMachineData);

        } else { // Returns all record, save as session

            var date = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
            var dateString = date.toISOString();

            machineData = await MachineData.find({ machineId: req.params.machineId, time_added : { $gt : dateString } }).exec();
            req.session.machineData = machineData;

            res.json(machineData);
        }

    } catch(err) {
        res.json({ message: err });
    }    
    
});


// Object Count Function
function objectCount(obj) {
    var result = 0;
    for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
        result++;
        }
    }
    return result;
}



module.exports = router;