const express = require("express");
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getStats,
} = require("../controller/taskController");
const { validateTask } = require("../middleware/validateTask");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *       example:
 *         id: d5fE_asz
 *         title: Learn Express
 *         completed: false
 *     Response:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: The tasks managing API
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Returns the list of all the tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search tasks by title
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *               example:
 *                 success: true
 *                 message: Found 1 tasks matching 'learn'
 *                 data:
 *                   - id: 1
 *                     title: Learn Express
 *                     completed: false
 */
router.get("/tasks", getAllTasks);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Returns the statistics of tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The stats of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *               example:
 *                 success: true
 *                 message: Stats retrieved successfully
 *                 data:
 *                   totalTasks: 5
 *                   completedTasks: 2
 *                   pendingTasks: 3
 */
router.get("/stats", getStats);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *               example:
 *                 success: true
 *                 message: Task retrieved successfully
 *                 data:
 *                   id: 1
 *                   title: Learn Express
 *                   completed: false
 *       404:
 *         description: The task was not found
 */
router.get("/tasks/:id", getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: New Task
 *             completed: false
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Validation Error
 */
router.post("/tasks", validateTask, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update the task by the id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: Updated Task Name
 *             completed: true
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *               example:
 *                 success: true
 *                 message: Task updated successfully
 *                 data:
 *                   id: 1
 *                   title: Updated Task Name
 *                   completed: true
 *       404:
 *         description: The task was not found
 *       400:
 *         description: Validation Error
 */
router.put("/tasks/:id", validateTask, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 */
router.delete("/tasks/:id", deleteTask);

module.exports = router;
