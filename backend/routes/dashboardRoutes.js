const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Admin') {
            const projects = await Project.find({ owner: req.user._id });
            const projectIds = projects.map(p => p._id);
            tasks = await Task.find({ project: { $in: projectIds } });
        } else {
            tasks = await Task.find({ assignedTo: req.user._id });
        }

        const totalTasks = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        
        const now = new Date();
        const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed').length;

        res.json({
            totalTasks,
            statusCounts: { Completed: completed, 'In Progress': inProgress, Pending: pending },
            overdue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
