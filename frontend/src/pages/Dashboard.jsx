// frontend/src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { ClipboardList, ListChecks, PiggyBank, Plus, Wallet } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApiData } from "../hooks/useApiData";
import { getTasks } from "../services/taskService";
import { getAssignments } from "../services/assignmentService";
import { getExpenseSummary } from "../services/expenseService";
import { currentMonthName, daysUntil, dueLabel, formatPeso, formatToday } from "../utils/format";
import { priorityStyle } from "../utils/colors";
import { categoryInfo } from "../utils/categories";
import SubjectChip from "../components/SubjectChip";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card, { CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ProgressBar from "../components/ui/ProgressBar";
import Skeleton, { SkeletonRows } from "../components/ui/Skeleton";

// Loads everything the dashboard shows, all at the same time.
// It's outside the component so useApiData gets the same function on every render.
const loadDashboard = () =>
  Promise.all([getTasks(), getAssignments(), getExpenseSummary()]).then(([tasks, assignments, summary]) => ({
    tasks,
    assignments,
    summary,
  }));

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// One of the three number tiles at the top
const StatTile = ({ icon: Icon, iconClass, label, value, valueClass = "text-ink", className = "", children }) => (
  <Card className={`p-5 ${className}`}>
    <div className="flex items-center gap-3">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${iconClass}`}>
        <Icon size={18} />
      </span>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
    <p className={`mt-4 text-3xl font-bold tracking-tight tabular-nums ${valueClass}`}>{value}</p>
    <div className="mt-3 text-sm text-slate-500">{children}</div>
  </Card>
);

const ViewAllLink = ({ to }) => (
  <Link to={to} className="shrink-0 rounded-md text-sm font-semibold text-brand hover:underline">
    View all
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { data, loading, error } = useApiData(loadDashboard, { tasks: [], assignments: [], summary: null });
  const { tasks, assignments, summary } = data;

  const openTasks = tasks.filter((task) => task.status !== "completed");
  const doneCount = tasks.length - openTasks.length;

  // The server already sorts assignments by due date, so the first ones are the most urgent
  const upcoming = assignments.filter((a) => a.status !== "completed");
  const dueThisWeek = upcoming.filter((a) => a.due_date && daysUntil(a.due_date) >= 0 && daysUntil(a.due_date) <= 7);
  const overdue = upcoming.filter((a) => a.due_date && daysUntil(a.due_date) < 0);

  const hasBudget = summary && summary.budget > 0;
  const overBudget = hasBudget && summary.remaining < 0;
  const spending = summary ? [...summary.byCategory].sort((a, b) => Number(b.total) - Number(a.total)) : [];

  const firstName = user?.name?.split(" ")[0] || "there";
  const today = formatToday();
  const month = currentMonthName();

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{today}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {greeting()}, {firstName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button to="/tasks" variant="secondary">
            <Plus size={18} /> Add task
          </Button>
          <Button to="/expenses">
            <Plus size={18} /> Log expense
          </Button>
        </div>
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      {/* The three numbers that matter most today */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40 sm:col-span-2" />
          </>
        ) : (
          <>
            <StatTile
              icon={ClipboardList}
              iconClass="bg-amber-50 text-amber-600"
              label="Due this week"
              value={dueThisWeek.length}
            >
              {overdue.length > 0 ? (
                <span className="font-semibold text-danger">{overdue.length} overdue</span>
              ) : (
                "Nothing overdue"
              )}
            </StatTile>

            <StatTile icon={ListChecks} iconClass="bg-brand-soft text-brand" label="Open tasks" value={openTasks.length}>
              {tasks.length > 0 ? (
                <>
                  <ProgressBar value={doneCount} max={tasks.length} barClassName="bg-emerald-500" className="mb-2" />
                  {doneCount} of {tasks.length} done
                </>
              ) : (
                "No tasks added yet"
              )}
            </StatTile>

            <StatTile
              icon={Wallet}
              iconClass="bg-emerald-50 text-emerald-600"
              label={overBudget ? `Over budget in ${month}` : hasBudget ? `Left to spend in ${month}` : `Spent in ${month}`}
              value={hasBudget ? formatPeso(Math.abs(summary.remaining)) : formatPeso(summary?.spent)}
              valueClass={overBudget ? "text-danger" : "text-ink"}
              className="sm:col-span-2"
            >
              {hasBudget ? (
                <>
                  <ProgressBar
                    value={summary.spent}
                    max={summary.budget}
                    barClassName={overBudget ? "bg-danger" : "bg-brand"}
                    className="mb-2"
                  />
                  {formatPeso(summary.spent)} of {formatPeso(summary.budget)} spent
                </>
              ) : (
                <Link to="/expenses" className="font-semibold text-brand hover:underline">
                  Set a monthly budget to see what's left
                </Link>
              )}
            </StatTile>
          </>
        )}
      </div>

      {/* Left: assignments. Right: tasks and spending stacked, so both columns end at about the same height. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5 lg:items-start">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Up next"
            description="Assignments you haven't finished, soonest first"
            action={<ViewAllLink to="/assignments" />}
          />
          {loading ? (
            <SkeletonRows rows={4} />
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="You're all caught up"
              description="New assignments will show up here, soonest due date first."
            />
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.slice(0, 5).map((assignment) => {
                const due = dueLabel(assignment.due_date);
                return (
                  <li key={assignment.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{assignment.title}</p>
                      <div className="mt-1.5">
                        <SubjectChip id={assignment.subject_id} name={assignment.subject_name} />
                      </div>
                    </div>
                    <Badge tone={due.tone}>{due.text}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="To-do" description="Your open tasks" action={<ViewAllLink to="/tasks" />} />
            {loading ? (
              <SkeletonRows rows={3} />
            ) : openTasks.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="No open tasks"
                description="Quick to-dos you add on the Tasks page show up here."
              />
            ) : (
              <ul className="divide-y divide-line">
                {openTasks.slice(0, 5).map((task) => {
                  const priority = priorityStyle(task.priority);
                  return (
                    <li key={task.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${priority.dot}`} />
                      <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{task.title}</p>
                      <span className="text-xs text-slate-500">{priority.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              title={`Spending in ${month}`}
              description="Where this month's money went"
              action={<ViewAllLink to="/expenses" />}
            />
            {loading ? (
              <SkeletonRows rows={3} />
            ) : spending.length === 0 ? (
              <EmptyState
                icon={PiggyBank}
                title="Nothing spent yet this month"
                description="When you log an expense, it's grouped by category here."
              />
            ) : (
              <ul className="space-y-4 p-5">
                {spending.map((row) => {
                  const info = categoryInfo(row.category);
                  const Icon = info.icon;
                  return (
                    <li key={row.category} className="flex items-center gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${info.tile}`}>
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="font-medium text-ink">{row.category}</span>
                          <span className="font-semibold tabular-nums text-ink">{formatPeso(row.total)}</span>
                        </div>
                        <ProgressBar
                          value={Number(row.total)}
                          max={summary.spent}
                          barClassName={info.bar}
                          className="mt-2"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
