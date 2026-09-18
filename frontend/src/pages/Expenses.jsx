import { useState, useEffect } from "react";
import {
  getExpenses,
  getExpenseSummary,
  createExpense,
  deleteExpense,
  updateBudget,
} from "../services/expenseService";

const CATEGORIES = ["Food", "Transportation", "School", "Bills", "Entertainment", "Other"];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [budgetInput, setBudgetInput] = useState("");

  const loadData = async () => {
    const [e, s] = await Promise.all([getExpenses(), getExpenseSummary()]);
    setExpenses(e);
    setSummary(s);
  };

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount) return;
    await createExpense({ category, amount: parseFloat(amount), description });
    setAmount("");
    setDescription("");
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    loadData();
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budgetInput) return;
    await updateBudget(parseFloat(budgetInput));
    setBudgetInput("");
    loadData();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      {summary && (
        <div className="border rounded p-4 mb-6 bg-gray-50">
          <div className="flex justify-between text-sm mb-1">
            <span>Spent this month: ₱{summary.spent.toFixed(2)}</span>
            <span>Budget: ₱{summary.budget.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className={`h-2 rounded ${summary.spent > summary.budget ? "bg-red-500" : "bg-blue-600"}`}
              style={{ width: `${summary.budget > 0 ? Math.min((summary.spent / summary.budget) * 100, 100) : 0}%` }}
            />
          </div>
          <p className={`text-sm mt-1 ${summary.remaining < 0 ? "text-red-500" : "text-gray-600"}`}>
            {summary.remaining < 0 ? "Over budget by" : "Remaining:"} ₱{Math.abs(summary.remaining).toFixed(2)}
          </p>
        </div>
      )}

      <form onSubmit={handleSetBudget} className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Set monthly budget"
          type="number"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
        />
        <button className="bg-gray-700 text-white px-4 rounded" type="submit">Save Budget</button>
      </form>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6">
        <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          className="border p-2 rounded w-28"
          placeholder="Amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border p-2 rounded flex-1"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded" type="submit">Add</button>
      </form>

      <ul className="flex flex-col gap-2">
        {expenses.map((exp) => (
          <li key={exp.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{exp.category} — ₱{parseFloat(exp.amount).toFixed(2)}</p>
              {exp.description && <p className="text-sm text-gray-500">{exp.description}</p>}
            </div>
            <button onClick={() => handleDelete(exp.id)} className="text-sm text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;