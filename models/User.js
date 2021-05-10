var mongoose = require('mongoose');
var moment = require('moment-timezone');

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },password: {
        type: String,
        required: true
    },email: {
        type: String
    },machineList: {
        type: Array,
        required: true
    },time_created: {
        type: String,
        default: getCurrentTime()
    }
});

function getCurrentTime() {
    return moment().tz("Asia/Singapore").format("DD-MM-YYYY HH:mm:ss");
}



module.exports = mongoose.model('User', UserSchema);