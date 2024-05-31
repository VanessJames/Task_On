const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get tasks
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create task
router.post('/', authMiddleware, async (req, res) => {
    const { task, priority } = req.body;
    try {
        const newTask = new Task({ userId: req.user.id, task, priority });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { task, priority, completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { task, priority, completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
