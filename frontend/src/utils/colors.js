// frontend/src/utils/colors.js

// Each subject gets its own color, picked from this list by its id,
// so "IT 105" looks the same on the Subjects page, the Assignments page and the Dashboard.
const SUBJECT_COLORS = [
  { chip: "bg-blue-50 text-blue-700", dot: "bg-blue-500", tile: "bg-blue-100 text-blue-700" },
  { chip: "bg-violet-50 text-violet-700", dot: "bg-violet-500", tile: "bg-violet-100 text-violet-700" },
  { chip: "bg-teal-50 text-teal-700", dot: "bg-teal-500", tile: "bg-teal-100 text-teal-700" },
  { chip: "bg-amber-50 text-amber-800", dot: "bg-amber-500", tile: "bg-amber-100 text-amber-800" },
  { chip: "bg-rose-50 text-rose-700", dot: "bg-rose-500", tile: "bg-rose-100 text-rose-700" },
  { chip: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", tile: "bg-emerald-100 text-emerald-700" },
];

export const subjectColor = (id) => SUBJECT_COLORS[(Number(id) || 0) % SUBJECT_COLORS.length];

// How each priority level looks. `tone` is a <Badge> tone, `dot` a background color.
const PRIORITY = {
  high: { label: "High", tone: "red", dot: "bg-danger" },
  medium: { label: "Medium", tone: "amber", dot: "bg-amber-400" },
  low: { label: "Low", tone: "gray", dot: "bg-slate-300" },
};

export const priorityStyle = (level) => PRIORITY[level] || PRIORITY.medium;
