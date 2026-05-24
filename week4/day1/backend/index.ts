require("dotenv").config();
import express from "express";
import { taskRoutes } from "./routes/tasksRoutes.js";
const cors = require("cors");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

interface Todo {
  id: string;
  title: string;
  completed?: boolean;
}

// store tasks in-memory
export let todos: Record<string, Todo> = {};
export let nextId: Number = 1;

app.use("/api", taskRoutes);

export default app;
