import { useState, useEffect, type FormEvent } from "react";

const App = () => {
  interface Todo {
    id: string;
    title: string;
    completed: boolean;
  }

  // 1. create usestates for old and new tasks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  // const BASE_URL =

  // 2. fetch all tasks from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://week4-day1-backend-2.vercel.app/api/tasks",
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  // 4. submit handler || create task function
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(
        "https://week4-day1-backend-2.vercel.app/api/tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTask }),
        },
      );

      if (!response.ok) throw new Error("Failed to add task!");
      const createdTask = await response.json();
      setTodos([...todos, createdTask]);
      setNewTask("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  // 5. handleToggle function
  const handleToggle = async (id: String, currentStatus: boolean) => {
    try {
      const response = await fetch(
        `https://week4-day1-backend-2.vercel.app/api/tasks/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !currentStatus }),
        },
      );
      if (!response.ok) throw new Error("Failed to update");
      const updatedTodo = await response.json();
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  // 6. handleDelete function
  const handleDelete = async (id: String) => {
    try {
      const response = await fetch(
        `https://week4-day1-backend-2.vercel.app/api/tasks/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete!");
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="bg-blue-400 px-10 pt-5 pb-20 rounded-xl ">
          <h3 className="mb-5 text-[#3B455D] text-2xl font-bold text-center">
            Todo List
          </h3>
          <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                placeholder="Add your task"
                // 3.
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="outline-none rounded-full px-5 pr-20 py-2 bg-[#EDEEF0] w-full"
              />
              <button
                type="submit"
                className="relative right-12 bg-[#FF5845] hover:bg-[#f83d28] px-5 rounded-full text-white cursor-pointer transition-all"
              >
                ADD
              </button>
            </form>
          </div>

          {/* converting static data into dynamic */}
          <div className="mt-5 text-white">
            {todos.map((todo) => (
              <div key={todo.id} className="flex justify-between items-center">
                <div className="flex justify-center items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id, todo.completed)}
                    className="h-5 w-5 rounded-xl text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <p
                    className={
                      todo.completed ? "line-through text-gray-300" : ""
                    }
                  >
                    {todo.title}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-black cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="text-black cursor-pointer"
                  >
                    <path d="m7.76 14.83-2.83 2.83 1.41 1.41 2.83-2.83 2.12-2.12.71-.71.71.71 1.41 1.42 3.54 3.53 1.41-1.41-3.53-3.54-1.42-1.41-.71-.71 5.66-5.66-1.41-1.41L12 10.59 6.34 4.93 4.93 6.34 10.59 12l-.71.71z"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
