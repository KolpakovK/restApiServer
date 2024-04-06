const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    timeEstimate: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model("Task",taskSchema)