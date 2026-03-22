const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String
    },
    requestCount: {type: Number, default: 0},
    lastRequestDate: {type:Date, default: Date.now}
}, {timeStamps: true});

module.exports = mongoose.model("User", userSchema);