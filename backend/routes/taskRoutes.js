const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all tasks for a user
router.get('/', protect, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Admin') {
            // Admin sees tasks for projects they own
            const projects = await Project.find({ owner: req.user._id });
            const projectIds = projects.map(p => p._id);
            tasks = await Task.find({ project: { $in: projectIds } }).populate('project', 'name').populate('assignedTo', 'name email');
        } else {
            // Member sees all tasks
            tasks = await Task.find().populate('project', 'name').populate('assignedTo', 'name email');
        }
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a task (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, description, project, assignedTo, dueDate } = req.body;
        
        // Ensure the admin owns the project
        const projectExists = await Project.findById(project);
        if (!projectExists || projectExists.owner.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Invalid project or unauthorized' });
        }

        const task = new Task({
            title,
            description,
            project,
            assignedTo,
            dueDate
        });
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task status (Member or Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Allow update if admin owns the project OR if member is assigned to it
        let isAuthorized = false;
        if (req.user.role === 'Admin') {
            const project = await Project.findById(task.project);
            if (project && project.owner.toString() === req.user._id.toString()) {
                isAuthorized = true;
            }
        } else {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status || task.status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
