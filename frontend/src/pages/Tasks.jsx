// client/src/pages/Tasks.jsx
import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title, priority });
    setTitle("");
    loadTasks();
  };

  const toggleComplete = async (t) => {
    await updateTask(t.id, { ...t, status: t.status === "completed" ? "pending" : "completed" });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select className="border p-2 rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="bg-blue-600 text-white px-4 rounded" type="submit">Add</button>
      </form>

      <ul className="flex flex-col gap-2">
        {tasks.map((t) => (
          <li key={t.id} className="border p-3 rounded flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.status === "completed"}
                onChange={() => toggleComplete(t)}
              />
              <span className={t.status === "completed" ? "line-through text-gray-400" : ""}>
                {t.title}
              </span>
            </label>
            <button onClick={() => handleDelete(t.id)} className="text-sm text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;