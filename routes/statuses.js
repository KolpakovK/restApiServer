const express = require("express");
const router = express.Router();
const status = require("../models/status")

//Getting all
router.get("/", async (req, res) => {
    try{
        let query = status.find();

        if (req.query.limit){
            const limit = parseInt(req.query.limit, 10);
            query = query.sort({ _id:   1 }).limit(limit);
        }

        const result = await query.exec();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Getting one
router.get("/:id", getStatus, (req, res) => {
    res.json(res.data)
})

//Creating one
router.post("/", async (req, res) => {
    const data = new status(req.body);

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
        const updatedStatus = await status.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedStatus) {
          return res.status(404).json({ message: "Status not found" });
        }
        res.json({ message: "Status updated successfully", data: updatedStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Status" });
    }
})

//Deleting one
router.delete("/:id", getStatus, async (req, res) => {
    try {
        await status.findByIdAndDelete(res.data.id);
        res.json({ message: "Succesful deleting" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


async function getStatus(req, res, next){
    let data
    try {
        data = await status.findById(req.params.id);
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