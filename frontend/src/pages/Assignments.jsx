// frontend/src/pages/Assignments.jsx
import { useState } from "react";
import { CalendarDays, CircleCheck, ClipboardList, Flag, Plus, Trash2 } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "../services/assignmentService";
import { getSubjects } from "../services/subjectService";
import { dueLabel, toDateString } from "../utils/format";
import { priorityStyle } from "../utils/colors";
import SubjectChip from "../components/SubjectChip";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CompleteToggle from "../components/ui/CompleteToggle";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import Select from "../components/ui/Select";
import { SkeletonRows } from "../components/ui/Skeleton";

const loadAssignmentsPage = () =>
  Promise.all([getAssignments(), getSubjects()]).then(([assignments, subjects]) => ({ assignments, subjects }));

// What the list says when the selected filter has nothing in it
const EMPTY_MESSAGES = {
  pending: {
    icon: CircleCheck,
    title: "Nothing left to submit",
    description: "When a new assignment comes in, add it above.",
  },
  completed: {
    icon: ClipboardList,
    title: "Nothing marked done yet",
    description: "Tick the circle beside an assignment once you've submitted it.",
  },
  all: {
    icon: ClipboardList,
    title: "No assignments yet",
    description: "Pick a subject, give it a title and a due date, then press Add.",
  },
};

const Assignments = () => {
  const { data, loading, error, reload } = useApiData(loadAssignmentsPage, { assignments: [], subjects: [] });
  const { assignments, subjects } = data;
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("pending");
  const [saving, setSaving] = useState(false);

  const pending = assignments.filter((a) => a.status !== "completed");
  const completed = assignments.filter((a) => a.status === "completed");
  const visible = filter === "pending" ? pending : filter === "completed" ? completed : assignments;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!subjectId || !title.trim()) return;
    setSaving(true);
    try {
      // An empty date input gives "", which PostgreSQL can't store in a DATE column, so send null
      await createAssignment({ subject_id: subjectId, title, due_date: dueDate || null, priority });
      setTitle("");
      setDueDate("");
      await reload();
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (assignment) => {
    const status = assignment.status === "completed" ? "pending" : "completed";
    // toDateString keeps the due date as "2026-10-14" so saving never shifts it by a day
    await updateAssignment(assignment.id, {
      ...assignment,
      due_date: toDateString(assignment.due_date),
      status,
    });
    reload();
  };

  const handleDelete = async (id) => {
    await deleteAssignment(id);
    reload();
  };

  const empty = EMPTY_MESSAGES[filter];

  return (
    <>
      <PageHeader title="Assignments" description="Everything you need to submit, soonest first." />

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="mb-8 p-5">
        {!loading && subjects.length === 0 ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Add a subject first. Every assignment belongs to one of your classes.
            </p>
            <Button to="/subjects" variant="secondary" size="sm">
              <Plus size={16} /> Add a subject
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleAdd}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_2fr_1.2fr_1fr_auto] lg:items-end"
          >
            <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
              <option value="">Choose a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code ? `${subject.code}: ${subject.name}` : subject.name}
                </option>
              ))}
            </Select>
            <Input
              label="Title"
              placeholder="e.g. Java OOP activity"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Button type="submit" disabled={saving} className="sm:col-span-2 lg:col-span-1">
              <Plus size={18} /> Add
            </Button>
          </form>
        )}
      </Card>

      <div className="mb-4">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { value: "pending", label: "To do", count: pending.length },
            { value: "completed", label: "Done", count: completed.length },
            { value: "all", label: "All", count: assignments.length },
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
            {visible.map((assignment) => {
              const done = assignment.status === "completed";
              const due = dueLabel(assignment.due_date);
              const level = priorityStyle(assignment.priority);
              return (
                <li key={assignment.id} className="flex items-center gap-4 px-5 py-4">
                  <CompleteToggle
                    checked={done}
                    onToggle={() => toggleComplete(assignment)}
                    label={`Mark "${assignment.title}" as ${done ? "not done" : "done"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-medium ${done ? "text-slate-400 line-through" : "text-ink"}`}>
                      {assignment.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <SubjectChip id={assignment.subject_id} name={assignment.subject_name} />
                      {!done && (
                        <Badge tone={due.tone}>
                          <CalendarDays size={12} /> {due.text}
                        </Badge>
                      )}
                      <Badge tone={done ? "gray" : level.tone}>
                        <Flag size={12} /> {level.label}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghostDanger"
                    size="icon"
                    onClick={() => handleDelete(assignment.id)}
                    aria-label={`Delete "${assignment.title}"`}
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

export default Assignments;
