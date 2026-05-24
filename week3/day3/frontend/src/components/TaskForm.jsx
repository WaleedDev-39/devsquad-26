import { useState } from "react";

const TaskForm = ({ onCreate }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clear = () => {
    setTaskName("");
    setTaskDesc("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!taskName.trim() || !taskDesc.trim()) {
      setError("Task name and description are required.");
      return;
    }

    setLoading(true);
    try {
      await onCreate({ task_name: taskName, task_desc: taskDesc });
      clear();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">New Task</h2>

      {error ? (
        <div className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded mb-4">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="taskName" className="font-medium">
            Task name
          </label>
          <input
            id="taskName"
            className="border rounded px-3 py-2 outline-none"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g. Buy groceries"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="taskDesc" className="font-medium">
            Description
          </label>
          <textarea
            id="taskDesc"
            className="border rounded px-3 py-2 outline-none resize-none"
            rows={3}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Write a few details about the task"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Add task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
