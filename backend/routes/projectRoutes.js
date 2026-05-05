const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all projects for a user
router.get('/', protect, async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'Admin') {
            projects = await Project.find({ owner: req.user._id }).populate('members', 'name email');
        } else {
            projects = await Project.find().populate('owner', 'name email');
        }
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a project (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const project = new Project({
            name,
            description,
            owner: req.user._id,
            members
        });
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
