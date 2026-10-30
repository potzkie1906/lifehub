// frontend/src/pages/Subjects.jsx
import { useState } from "react";
import { BookOpen, Plus, Trash2, UserRound } from "lucide-react";
import { useApiData } from "../hooks/useApiData";
import { createSubject, deleteSubject, getSubjects } from "../services/subjectService";
import { getAssignments } from "../services/assignmentService";
import { subjectColor } from "../utils/colors";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import Skeleton from "../components/ui/Skeleton";

// Subjects plus assignments, so each card can say how many are still to submit
const loadSubjectsPage = () =>
  Promise.all([getSubjects(), getAssignments()]).then(([subjects, assignments]) => ({ subjects, assignments }));

const Subjects = () => {
  const { data, loading, error, reload } = useApiData(loadSubjectsPage, { subjects: [], assignments: [] });
  const { subjects, assignments } = data;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [teacher, setTeacher] = useState("");
  const [saving, setSaving] = useState(false);

  const pendingCount = (subjectId) =>
    assignments.filter((a) => a.subject_id === subjectId && a.status !== "completed").length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createSubject({ name, code, teacher });
      setName("");
      setCode("");
      setTeacher("");
      await reload();
    } finally {
      setSaving(false); // runs even if the request fails, so the button never stays disabled
    }
  };

  const handleDelete = async (subject) => {
    // Deleting a subject also deletes its assignments (ON DELETE CASCADE in the database),
    // so ask first and say how many will go with it.
    const count = assignments.filter((a) => a.subject_id === subject.id).length;
    const extra = count > 0 ? ` Its ${count} assignment${count === 1 ? "" : "s"} will be deleted too.` : "";
    if (!window.confirm(`Delete ${subject.name}?${extra}`)) return;

    await deleteSubject(subject.id);
    reload();
  };

  return (
    <>
      <PageHeader title="Subjects" description="The classes you're taking this semester." />

      {error && <Alert className="mb-6">{error}</Alert>}

      <Card className="mb-8 p-5">
        <form
          onSubmit={handleAdd}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_2fr_auto] lg:items-end"
        >
          <Input
            label="Subject name"
            placeholder="e.g. Web Development"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input label="Code" placeholder="IT 105" value={code} onChange={(e) => setCode(e.target.value)} />
          <Input
            label="Teacher"
            icon={UserRound}
            placeholder="Prof. Santos"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="sm:col-span-2 lg:col-span-1"
          />
          <Button type="submit" disabled={saving} className="sm:col-span-2 lg:col-span-1">
            <Plus size={18} /> Add subject
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            description="Add the classes you're taking. Every assignment you add later belongs to one of them."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const color = subjectColor(subject.id);
            const pending = pendingCount(subject.id);
            return (
              <Card key={subject.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${color.tile}`}>
                    <BookOpen size={20} />
                  </span>
                  <Button
                    variant="ghostDanger"
                    size="icon"
                    onClick={() => handleDelete(subject)}
                    aria-label={`Delete ${subject.name}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="mt-4 flex-1">
                  <h2 className="font-semibold text-ink">{subject.name}</h2>
                  {subject.code && <p className="mt-0.5 text-sm font-medium text-slate-500">{subject.code}</p>}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                  <span className="flex min-w-0 items-center gap-1.5 text-slate-500">
                    <UserRound size={15} className="shrink-0" />
                    <span className="truncate">{subject.teacher || "No teacher added"}</span>
                  </span>
                  <Badge tone={pending > 0 ? "blue" : "gray"}>
                    {pending > 0 ? `${pending} to submit` : "Nothing due"}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Subjects;
