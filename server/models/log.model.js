
const mongoose = require("mongoose")

const LogSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true,"Please title your marker"]
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    travelDate: {
        type: Date,
    },
    searchAddress: {
        type: String,
    }
}, {timestamps : true})

const Log = mongoose.model("LogSchema", LogSchema)
module.exports = Log