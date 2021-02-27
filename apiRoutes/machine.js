var express = require('express');
var MachineData = require('../models/MachineData');

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
        mq2 : req.param("mq2"),
        mq7 : req.param("mq7"),
        mq135 : req.param("mq135"),
        sound : sound,
        time_added : new Date().toISOString()
    });

    try{
        uploadedData = await machineData.save();
        // console.log(uploadedData);
        res.json(uploadedData);

    } catch(err) {
        res.json({ message: err });
    }
    
});


// Get All Machine Data (Disabled)
// router.get('/get', async (req, res) => {

//     try{
//         var machineDatas = await MachineData.find();
//         res.json(machineDatas);
//     } catch(err) {
//         res.json({ message: err });
//     }
    
// });


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

            // console.log(newMachineData);
            res.json(newMachineData);

        } else { // Returns all record, save as session

            var date = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
            var dateString = date.toISOString();

            machineData = await MachineData.find({ machineId: req.params.machineId, time_added : { $gt : dateString } }).exec();
            req.session.machineData = machineData;

            // console.log(machineData);
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
        // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
        }
    }
    return result;
}



module.exports = router;