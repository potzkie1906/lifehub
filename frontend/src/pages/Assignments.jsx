// client/src/pages/Assignments.jsx
import { useState, useEffect } from "react";
import { getSubjects } from "../services/subjectService";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../services/assignmentService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const loadData = async () => {
    const [a, s] = await Promise.all([getAssignments(), getSubjects()]);
    setAssignments(a);
    setSubjects(s);
  };

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!subjectId) return;
    await createAssignment({ subject_id: subjectId, title, due_date: dueDate, priority });
    setTitle("");
    setDueDate("");
    loadData();
  };

  const toggleComplete = async (a) => {
    const newStatus = a.status === "completed" ? "pending" : "completed";
    await updateAssignment(a.id, { ...a, status: newStatus });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteAssignment(id);
    loadData();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6">
        <select className="border p-2 rounded" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input className="border p-2 rounded flex-1" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 rounded" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select className="border p-2 rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="bg-blue-600 text-white px-4 rounded" type="submit">Add</button>
      </form>

      <ul className="flex flex-col gap-2">
        {assignments.map((a) => (
          <li key={a.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className={`font-semibold ${a.status === "completed" ? "line-through text-gray-400" : ""}`}>
                {a.title}
              </p>
              <p className="text-sm text-gray-500">
                {a.subject_name} · Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "no date"} · {a.priority}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => toggleComplete(a)} className="text-sm text-green-600">
                {a.status === "completed" ? "Undo" : "Complete"}
              </button>
              <button onClick={() => handleDelete(a.id)} className="text-sm text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;