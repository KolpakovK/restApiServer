const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema({
    note:{
        type: String,
        default:""
    },
    date:{
        type: Date,
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    timeEstimate: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model("TimeEntry",timeEntrySchema)