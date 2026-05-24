import { useState } from "react";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditName(task.task_name);
    setEditDesc(task.task_desc);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEdit = async () => {
    if (!editingTaskId) return;
    await onUpdate(editingTaskId, { task_name: editName, task_desc: editDesc });
    cancelEdit();
  };

  if (!tasks?.length) {
    return (
      <div className="text-gray-600">
        No tasks yet. Use the form above to create one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isEditing = editingTaskId === task._id;
        return (
          <div
            key={task._id}
            className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-start gap-4">
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    className="border rounded px-3 py-2 w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <textarea
                    className="border rounded px-3 py-2 w-full resize-none"
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{task.task_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.task_desc}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-sm bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task._id)}
                      className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Created: {new Date(task.createdAt).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
