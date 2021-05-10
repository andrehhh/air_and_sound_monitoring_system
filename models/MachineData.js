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
    },lpg: {
        type: Number,
        required: true
    },alcohol: {
        type: Number,
        required: true
    },co: {
        type: Number,
        required: true
    },co2: {
        type: Number,
        required: true
    },smoke: {
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