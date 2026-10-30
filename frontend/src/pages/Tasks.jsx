// frontend/src/pages/Tasks.jsx
import { useState } from "react";
import { CircleCheck, ListChecks, Plus, Trash2 } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskService";
import { toDateString } from "../utils/format";
import { priorityStyle } from "../utils/colors";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CompleteToggle from "../components/ui/CompleteToggle";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import ProgressBar from "../components/ui/ProgressBar";
import SegmentedControl from "../components/ui/SegmentedControl";
import Select from "../components/ui/Select";
import { SkeletonRows } from "../components/ui/Skeleton";

const EMPTY_MESSAGES = {
  open: { icon: CircleCheck, title: "All done", description: "No open tasks. Add one above when something comes up." },
  done: { icon: ListChecks, title: "Nothing checked off yet", description: "Tasks you finish will move here." },
  all: { icon: ListChecks, title: "No tasks yet", description: "Add quick to-dos like errands or reminders above." },
};

const Tasks = () => {
  // getTasks comes from the service file, so it's already the same function on every render
  const { data: tasks, loading, error, reload } = useApiData(getTasks, []);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("open");
  const [saving, setSaving] = useState(false);

  const openTasks = tasks.filter((task) => task.status !== "completed");
  const doneTasks = tasks.filter((task) => task.status === "completed");
  const visible = filter === "open" ? openTasks : filter === "done" ? doneTasks : tasks;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await createTask({ title, priority });
      setTitle("");
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (task) => {
    const status = task.status === "completed" ? "pending" : "completed";
    await updateTask(task.id, { ...task, due_date: toDateString(task.due_date), status });
    reload();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    reload();
  };

  const empty = EMPTY_MESSAGES[filter];

  return (
    <>
      <PageHeader title="Tasks" description="Quick to-dos that aren't tied to a class.">
        {tasks.length > 0 && (
          <div className="w-56">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-600">Progress</span>
              <span className="font-semibold tabular-nums text-ink">
                {doneTasks.length} of {tasks.length} done
              </span>
            </div>
            <ProgressBar value={doneTasks.length} max={tasks.length} barClassName="bg-emerald-500" />
          </div>
        )}
      </PageHeader>

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="mb-8 p-4">
        <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
          <Input
            aria-label="New task"
            placeholder="Add a task, like “Buy bond paper”"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            required
          />
          <Select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="sm:w-44">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </Select>
          <Button type="submit" disabled={saving}>
            <Plus size={18} /> Add task
          </Button>
        </form>
      </Card>

      <div className="mb-4">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { value: "open", label: "Open", count: openTasks.length },
            { value: "done", label: "Done", count: doneTasks.length },
            { value: "all", label: "All", count: tasks.length },
          ]}
        />
      </div>

      <Card>
        {loading ? (
          <SkeletonRows />
        ) : visible.length === 0 ? (
          <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((task) => {
              const done = task.status === "completed";
              const level = priorityStyle(task.priority);
              return (
                <li key={task.id} className="flex items-center gap-4 px-5 py-3.5">
                  <CompleteToggle
                    checked={done}
                    onToggle={() => toggleComplete(task)}
                    label={`Mark "${task.title}" as ${done ? "not done" : "done"}`}
                  />
                  <p
                    className={`min-w-0 flex-1 truncate font-medium ${
                      done ? "text-slate-400 line-through" : "text-ink"
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${done ? "bg-slate-300" : level.dot}`} />
                    {level.label}
                  </span>
                  <Button
                    variant="ghostDanger"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    aria-label={`Delete "${task.title}"`}
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

export default Tasks;
