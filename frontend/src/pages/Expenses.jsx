// frontend/src/pages/Expenses.jsx
import { useState } from "react";
import { CalendarDays, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import {
  createExpense,
  deleteExpense,
  getExpenseSummary,
  getExpenses,
  updateBudget,
} from "../services/expenseService";
import { currentMonthName, daysLeftInMonth, formatPeso, formatShortDate } from "../utils/format";
import { CATEGORIES, categoryInfo } from "../utils/categories";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card, { CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import ProgressBar from "../components/ui/ProgressBar";
import Skeleton, { SkeletonRows } from "../components/ui/Skeleton";

const loadExpensesPage = () =>
  Promise.all([getExpenses(), getExpenseSummary()]).then(([expenses, summary]) => ({ expenses, summary }));

const Expenses = () => {
  const { data, loading, error, reload } = useApiData(loadExpensesPage, { expenses: [], summary: null });
  const { expenses, summary } = data;
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [budgetInput, setBudgetInput] = useState("");
  const [editingBudget, setEditingBudget] = useState(false);
  const [saving, setSaving] = useState(false);

  const month = currentMonthName();
  const daysLeft = daysLeftInMonth();
  const hasBudget = summary && summary.budget > 0;
  const overBudget = hasBudget && summary.remaining < 0;
  const byCategory = summary ? [...summary.byCategory].sort((a, b) => Number(b.total) - Number(a.total)) : [];
  const showBudgetForm = editingBudget || (!loading && !hasBudget);

  const handleAdd = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return; // no zero or negative expenses
    setSaving(true);
    try {
      await createExpense({ category, amount: value, description });
      setAmount("");
      setDescription("");
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    reload();
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const value = parseFloat(budgetInput);
    if (Number.isNaN(value) || value < 0) return;
    await updateBudget(value);
    setBudgetInput("");
    setEditingBudget(false);
    reload();
  };

  return (
    <>
      <PageHeader title="Expenses" description="Where your allowance goes this month." />

      {error && <Alert className="mb-6">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Budget overview */}
        <Card className="flex flex-col p-6 lg:col-span-3">
          {loading ? (
            <>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-4 h-10 w-56" />
              <Skeleton className="mt-8 h-2 w-full" />
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {overBudget ? `Over budget in ${month}` : hasBudget ? `Left to spend in ${month}` : `Spent in ${month}`}
                  </p>
                  <p
                    className={`mt-2 text-4xl font-bold tracking-tight tabular-nums ${
                      overBudget ? "text-danger" : "text-ink"
                    }`}
                  >
                    {hasBudget ? formatPeso(Math.abs(summary.remaining)) : formatPeso(summary?.spent)}
                  </p>
                </div>
                {hasBudget && !editingBudget && (
                  <Button variant="secondary" size="sm" onClick={() => setEditingBudget(true)}>
                    <Pencil size={14} /> Edit budget
                  </Button>
                )}
              </div>

              {hasBudget && (
                // mt-auto pushes this part to the bottom of the card
                <div className="mt-auto pt-8">
                  <ProgressBar
                    value={summary.spent}
                    max={summary.budget}
                    barClassName={overBudget ? "bg-danger" : "bg-brand"}
                  />
                  <div className="mt-3 flex justify-between gap-4 text-sm text-slate-500">
                    <span>
                      <span className="font-semibold tabular-nums text-ink">{formatPeso(summary.spent)}</span> spent
                    </span>
                    <span>
                      Budget <span className="font-semibold tabular-nums text-ink">{formatPeso(summary.budget)}</span>
                    </span>
                  </div>

                  {/* What's left, split across the days left in the month */}
                  {!overBudget && (
                    <p className="mt-5 flex items-center gap-2.5 rounded-xl bg-canvas px-4 py-3 text-sm text-slate-600">
                      <CalendarDays size={18} className="shrink-0 text-brand" />
                      <span>
                        That's about{" "}
                        <span className="font-semibold text-ink">{formatPeso(summary.remaining / daysLeft)} a day</span>{" "}
                        for the {daysLeft} {daysLeft === 1 ? "day" : "days"} left in {month}.
                      </span>
                    </p>
                  )}
                </div>
              )}

              {showBudgetForm && (
                <form
                  onSubmit={handleSaveBudget}
                  className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-end"
                >
                  <Input
                    label={hasBudget ? "New monthly budget" : "Set a monthly budget to see what's left"}
                    prefix="₱"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="5000"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Save budget</Button>
                    {editingBudget && (
                      <Button variant="ghost" onClick={() => setEditingBudget(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </>
          )}
        </Card>

        {/* Spending by category this month */}
        <Card className="lg:col-span-2">
          <CardHeader title="By category" description={`Your spending in ${month}`} />
          {loading ? (
            <SkeletonRows rows={3} />
          ) : byCategory.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">Nothing logged this month yet.</p>
          ) : (
            <ul className="space-y-4 p-5">
              {byCategory.map((row) => {
                const info = categoryInfo(row.category);
                const Icon = info.icon;
                return (
                  <li key={row.category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <Icon size={16} className="text-slate-400" />
                        {row.category}
                      </span>
                      <span className="font-semibold tabular-nums text-ink">{formatPeso(row.total)}</span>
                    </div>
                    <ProgressBar value={Number(row.total)} max={summary.spent} barClassName={info.bar} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Log a new expense */}
      <Card className="mt-6 p-5 sm:p-6">
        <h2 className="font-semibold text-ink">Log an expense</h2>
        <form onSubmit={handleAdd} className="mt-4 space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Category</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ name, icon: Icon }) => {
                const selected = category === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(name)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      selected
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line bg-white text-slate-600 hover:border-slate-300 hover:text-ink"
                    }`}
                  >
                    <Icon size={16} /> {name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-[180px_1fr_auto] sm:items-end">
            <Input
              label="Amount"
              prefix="₱"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Note (optional)"
              placeholder="e.g. Lunch at the canteen"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" disabled={saving}>
              <Plus size={18} /> Add expense
            </Button>
          </div>
        </form>
      </Card>

      {/* Every expense ever logged */}
      <Card className="mt-6">
        <CardHeader title="History" description="Every expense you've logged, newest first" />
        {loading ? (
          <SkeletonRows />
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No expenses yet"
            description="Log your first one above. Even small ones like jeepney fare add up."
          />
        ) : (
          <ul className="divide-y divide-line">
            {expenses.map((expense) => {
              const info = categoryInfo(expense.category);
              const Icon = info.icon;
              const date = formatShortDate(expense.expense_date);
              return (
                <li key={expense.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${info.tile}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{expense.description || expense.category}</p>
                    <p className="text-sm text-slate-500">
                      {expense.description ? `${expense.category}, ${date}` : date}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums text-ink">{formatPeso(expense.amount)}</p>
                  <Button
                    variant="ghostDanger"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                    aria-label={`Delete ${expense.description || expense.category} expense`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
};

export default Expenses;
