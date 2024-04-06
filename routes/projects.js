const express = require("express");
const router = express.Router();
const project = require("../models/project")

const isAdmin = require("../middleware/auth");

//Getting all
router.get("/", async (req, res) => {
    try{
        let query = project.find().sort({ _id:-1 });

        if (req.query.name){
            query = project.find({ name: { $regex: req.query.name} });
        }
        if (req.query.limit){
            const limit = parseInt(req.query.limit, 10);
            query = query.limit(limit);
        }

        const result = await query.exec();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Getting one
router.get("/:id",isAdmin, getProject, (req, res) => {
    res.json(res.data)
})

//Creating one
router.post("/",isAdmin, async (req, res) => {
    const data = new project(req.body);

    try{
        const newRecord = await data.save();
        res.status(201).json(newRecord);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
})

//Updating one
router.patch("/:id",isAdmin, async (req, res) => {
    try {
        const updatedProject = await project.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedProject) {
          return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project updated successfully", data: updatedProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project" });
    }
})

//Deleting one
router.delete("/:id",isAdmin, getProject, async (req, res) => {
    try {
        await project.findByIdAndDelete(res.data.id);
        res.json({ message: "Succesful deleting" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getProject(req, res, next){
    let data
    try {
        data = await project.findById(req.params.id);
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