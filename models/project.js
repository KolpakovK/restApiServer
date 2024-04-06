const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        default: 1.0,
        required: true
    },
    color:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Project",projectSchema)