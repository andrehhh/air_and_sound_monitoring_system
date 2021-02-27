var mongoose = require('mongoose');
var moment = require('moment-timezone');

var MachineDataSchema = mongoose.Schema({
    machineId: {
        type: String,
        required: true
    },temperature: {
        type: Number,
        required: true
    },humidity: {
        type: Number,
        required: true
    },mq2: {
        type: Number,
        required: true
    },mq7: {
        type: Number,
        required: true
    },mq135: {
        type: Number,
        required: true
    },sound: {
        type: Boolean,
        required: true
    },time_added: {
        type: Date,
        default: new Date().toISOString()
    },
});


module.exports = mongoose.model('MachineData', MachineDataSchema);