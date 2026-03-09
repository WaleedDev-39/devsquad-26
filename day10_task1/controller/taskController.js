const fs = require("fs");
const path = require("path");
const { generateId, sendResponse } = require("../utils/helpers");

const TASKS_FILE = path.join(__dirname, "../tasks.json");

// Helper to read tasks from file
const readTasks = () => {
    try {
        const data = fs.readFileSync(TASKS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper to write tasks to file
const writeTasks = (tasks) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
};

// @desc    Get all tasks or search by title
// @route   GET /api/tasks
const getAllTasks = (req, res) => {
    const tasks = readTasks();
    const { title } = req.query;

    if (title) {
        const filteredTasks = tasks.filter((t) =>
            t.title.toLowerCase().includes(title.toLowerCase())
        );
        return sendResponse(
            res,
            200,
            true,
            filteredTasks,
            `Found ${filteredTasks.length} tasks matching '${title}'`
        );
    }

    return sendResponse(
        res,
        200,
        true,
        tasks,
        "All tasks retrieved successfully"
    );
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
const getTaskById = (req, res) => {
    const tasks = readTasks();
    const { id } = req.params;

    const task = tasks.find((t) => t.id === Number(id) || t.id === id);

    if (!task) {
        return sendResponse(res, 404, false, null, `Task with ID ${id} not found`);
    }

    return sendResponse(res, 200, true, task, "Task retrieved successfully");
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = (req, res) => {
    const tasks = readTasks();
    const { title, completed } = req.body;

    const newTask = {
        id: generateId(),
        title: title.trim(),
        completed: completed !== undefined ? completed : false,
    };

    tasks.push(newTask);
    writeTasks(tasks);

    return sendResponse(res, 201, true, newTask, "Task created successfully");
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = (req, res) => {
    const tasks = readTasks();
    const { id } = req.params;
    const { title, completed } = req.body;

    const taskIndex = tasks.findIndex((t) => t.id === Number(id) || t.id === id);

    if (taskIndex === -1) {
        return sendResponse(res, 404, false, null, `Task with ID ${id} not found`);
    }

    const updatedTask = {
        ...tasks[taskIndex],
        title: title !== undefined ? title.trim() : tasks[taskIndex].title,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);

    return sendResponse(res, 200, true, updatedTask, "Task updated successfully");
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = (req, res) => {
    const tasks = readTasks();
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === Number(id) || t.id === id);

    if (taskIndex === -1) {
        return sendResponse(res, 404, false, null, `Task with ID ${id} not found`);
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    return sendResponse(
        res,
        200,
        true,
        deletedTask[0],
        "Task deleted successfully"
    );
};

// @desc    Get task statistics
// @route   GET /api/stats
const getStats = (req, res) => {
    const tasks = readTasks();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const stats = {
        totalTasks,
        completedTasks,
        pendingTasks,
    };

    return sendResponse(res, 200, true, stats, "Stats retrieved successfully");
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getStats,
};
