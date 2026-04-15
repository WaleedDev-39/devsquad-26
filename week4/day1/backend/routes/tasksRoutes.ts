import { Router } from "express";
import { todos } from "../index.js";

const router: Router = Router();

// get all tasks
router.get("/tasks", (req, res) => {
  let todoList = Object.values(todos);

  //   filter pending and completed tasks
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === "true";
    todoList = todoList.filter((todo) => todo.completed === completed);
  }

  res.json(todoList);
});

// get a single task by id
router.get("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos[id];
  if (!todo) {
    return res.status(404).send("Task not found!");
  }
  res.json(todo);
});

// create a new task
router.post("/tasks", (req, res) => {
  const newTodo = {
    id: Date.now().toString(),
    title: req.body.title,
    completed: false,
  };
  todos[newTodo.id] = newTodo;
  res.status(201).json(newTodo);
});

// update a task
router.put("/tasks/:id", (req, res) => {
  const id = req.params.id;
  if (!todos[id]) {
    return res.status(404).send("Task not found!");
  }

  todos[id] = { ...todos[id], ...req.body };
  res.json(todos[id]);
});

// delete a task
router.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  if (!todos[id]) {
    return res.status(404).send("Task not found!");
  }
  delete todos[id];
  res.status(201).send("Task deleted!");
});

export const taskRoutes = router;
