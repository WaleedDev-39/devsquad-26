const { Task } = require("../models/Task");

const getAllTasks = async (req, res) => {
    try {
        // Only find tasks created by the logged-in user
        const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const createTask = async (req, res) => {
    try {
        const { task_name, task_desc } = req.body;

        const newTask = new Task({
            task_name,
            task_desc,
            createdBy: req.user.id, // Assign the logged-in user as creator
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const updateTask = async (req, res) => {
    try {
        const { task_name, task_desc } = req.body;

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        // Check user ownership
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized to update this task" });
        }

        // Update fields if provided
        task.task_name = task_name || task.task_name;
        task.task_desc = task_desc || task.task_desc;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.status(500).send("Server error");
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        // Check user ownership
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized to delete this task" });
        }

        await task.deleteOne();
        res.json({ msg: "Task removed" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.status(500).send("Server error");
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
};
