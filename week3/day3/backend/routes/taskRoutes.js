const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");

// All task routes are protected by auth middleware
router.use(auth);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for logged in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_name
 *               - task_desc
 *             properties:
 *               task_name:
 *                 type: string
 *               task_desc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Validation error
 */
router.post(
    "/",
    [
        check("task_name", "Task name is required").not().isEmpty(),
        check("task_desc", "Task description is required").not().isEmpty(),
    ],
    validateRequest,
    taskController.createTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_name:
 *                 type: string
 *               task_desc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 *       401:
 *         description: Not authorized
 */
router.put("/:id", taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task removed
 *       404:
 *         description: Task not found
 *       401:
 *         description: Not authorized
 */
router.delete("/:id", taskController.deleteTask);

module.exports = router;
