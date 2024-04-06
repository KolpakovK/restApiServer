const express = require("express");
const router = express.Router();
const task = require("../models/task")

//Getting all
router.get("/", async (req, res) => {
    try{
        let query = task.find();

        if (req.query.name){
            query = task.find({ name: { $regex: req.query.name} });
        }
        if (req.query.project){
            query = query.find({ project: req.query.project });
        }
        if (req.query.limit){
            const limit = parseInt(req.query.limit, 10);
            query = query.limit(limit);
        }

        const result = await query.sort({ _id:-1 }).populate("project").populate("status").exec();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Getting one
router.get("/:id", getTask, (req, res) => {
    res.json(res.data)
})

//Creating one
router.post("/", async (req, res) => {
    const data = new task(req.body);

    try{
        const newRecord = await data.save();
        res.status(201).json(newRecord);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
})

//Updating one
router.patch("/:id", async (req, res) => {
    try {
        const updatedTask = await task.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedTask) {
          return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task updated successfully", data: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Task" });
    }
})

//Deleting one
router.delete("/:id", getTask, async (req, res) => {
    try {
        await task.findByIdAndDelete(res.data.id);
        res.json({ message: "Succesful deleting" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getTask(req, res, next){
    let data
    try {
        data = await task.findById(req.params.id).populate("project").populate("status");
        if (data == null){
            return res.status(404).json({ message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    res.data = data;
    next();
}

module.exports = router