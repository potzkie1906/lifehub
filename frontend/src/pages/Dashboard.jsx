// client/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getTasks } from "../services/taskService";
import { getAssignments } from "../services/assignmentService";
import { getExpenseSummary } from "../services/expenseService";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);

  const loadDashboard = async () => {
    const [t, a, s] = await Promise.all([getTasks(), getAssignments(), getExpenseSummary()]);
    setTasks(t);
    setAssignments(a);
    setSummary(s);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  const todayTasks = tasks.filter((t) => t.status !== "completed").slice(0, 5);

  const upcomingAssignments = assignments
    .filter((a) => a.status !== "completed")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Good day, {user?.name}</h1>
      <p className="text-gray-500 mb-6">Here's what's on your plate.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Tasks remaining</p>
          <p className="text-3xl font-bold">{todayTasks.length}</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Assignments upcoming</p>
          <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Budget remaining</p>
          <p className={`text-3xl font-bold ${summary && summary.remaining < 0 ? "text-red-500" : ""}`}>
            {summary ? `₱${summary.remaining.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Tasks</h2>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing pending — nice.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {todayTasks.map((t) => (
                <li key={t.id} className="border p-2 rounded text-sm">{t.title}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Upcoming Assignments</h2>
          {upcomingAssignments.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing due — you're clear.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {upcomingAssignments.map((a) => (
                <li key={a.id} className="border p-2 rounded text-sm flex justify-between">
                  <span>{a.title} <span className="text-gray-400">— {a.subject_name}</span></span>
                  <span className="text-gray-500">
                    {a.due_date ? new Date(a.due_date).toLocaleDateString() : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;