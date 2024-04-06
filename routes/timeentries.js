const express = require("express");
const router = express.Router();
const timeEntry = require("../models/timeentry")

//Getting all
router.get("/", async (req, res) => {
    try{
        let query = timeEntry.find();
        
        if (req.query.from && req.query.to){

            const startDate = new Date(req.query.from);
            const endDate = new Date(req.query.to);

            query = query.find({
                date: {
                    $gte: startDate, // Дата больше или равна startDate
                    $lte: endDate     // Дата меньше чем endDate
                }
            });

        }
        if (req.query.limit){
            const limit = parseInt(req.query.limit, 10);
            query = query.limit(limit);
        }
        
        const result = await query.sort({ date: 1 }).populate({path:"task",populate:{path:"project status"}}).exec();
        res.json(transformData(result));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Getting one
router.get("/:id", getTimeEntry, (req, res) => {
    res.json(res.data)
})

//Creating one
router.post("/", async (req, res) => {
    const data = new timeEntry(req.body);
    
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
        const updatedEntry = await timeEntry.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        res.json({ message: "Entry updated successfully", data: updatedEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Entry" });
    }
})
    
//Deleting one
router.delete("/:id", getTimeEntry, async (req, res) => {
    try {
        await timeEntry.findByIdAndDelete(res.data.id);
        res.json({ message: "Succesful deleting" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
    
async function getTimeEntry(req, res, next){
    let data
    try {
        data = await timeEntry.findById(req.params.id).populate({path:"task",populate:{path:"project"}});
        if (data == null){
            return res.status(404).json({ message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
    res.data = data;
    next();
}
    
function transformData(data) {
    const result = [];
    
    for (const entry of data) {
        const task = {
            "_id": entry._id,
            "note": entry.note,
            "date": entry.date,
            "task": entry.task,
            "timeEstimate": entry.timeEstimate,
            "__v": entry.__v
        };
        
        const existingDay = result.find(item => item.date === entry.date.toISOString().split('T')[0]);
        
        if (existingDay) {
            existingDay.tasks.push(task);
        } else {
            result.push({
                "date": entry.date.toISOString().split('T')[0],
                "tasks": [task]
            });
        }
    }
    
    return result;
}
    
    module.exports = router