import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  createTask,
  deleteTask,
  getCurrentUser,
  getTasks,
  updateTask,
} from "../services/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user] = useState(getCurrentUser());

  const loadTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (task) => {
    const created = await createTask(task);
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdate = async (taskId, updates) => {
    const updated = await updateTask(taskId, updates);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return (
    <div className="px-4 py-10 max-w-5xl mx-auto">
      <header className="mb-8 flex flex-col gap-3 rounded-lg bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          {user ? (
            <p className="text-sm text-gray-600">
              Logged in as{" "}
              <span className="font-semibold">{user.fullName}</span> (
              {user.email})
            </p>
          ) : null}
        </div>
        <div className="text-sm text-gray-500">
          Manage your tasks below — create new, edit, or delete as needed.
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <TaskForm onCreate={handleCreate} />
        <div className="space-y-4">
          {loading ? (
            <div className="text-gray-600">Loading tasks…</div>
          ) : error ? (
            <div className="text-red-700 bg-red-100 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
