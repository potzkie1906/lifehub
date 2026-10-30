// frontend/src/utils/format.js
// Small helpers for showing money and dates. They're plain functions (not
// components), which is why they live in /utils instead of /components.

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

// 1760 -> "₱1,760.00"  (also works with the "1760.00" text PostgreSQL sends for NUMERIC)
export const formatPeso = (amount) => peso.format(Number(amount) || 0);

// Turns a date from the API into a Date at local midnight.
// "2026-10-14" is split into parts on purpose: new Date("2026-10-14") would read it
// as UTC, which can land on the wrong day depending on your timezone.
export const toLocalDate = (value) => {
  if (!value) return null;
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(text); // a full date-time like "2026-10-13T16:00:00.000Z"
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Date -> "2026-10-14", the format PostgreSQL and <input type="date"> expect
export const toDateString = (value) => {
  const date = toLocalDate(value);
  if (!date) return null;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

// "2026-10-14" -> "Oct 14"
export const formatShortDate = (value) =>
  toLocalDate(value).toLocaleDateString("en-PH", { month: "short", day: "numeric" });

const ONE_DAY = 24 * 60 * 60 * 1000;

// Whole days from today until the date (negative means it already passed)
export const daysUntil = (value) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((toLocalDate(value) - today) / ONE_DAY);
};

// A short label and a color for a due date, used by <Badge tone={...}>
export const dueLabel = (value) => {
  if (!value) return { text: "No due date", tone: "gray" };
  const days = daysUntil(value);
  if (days < -1) return { text: `${-days} days overdue`, tone: "red" };
  if (days === -1) return { text: "1 day overdue", tone: "red" };
  if (days === 0) return { text: "Due today", tone: "amber" };
  if (days === 1) return { text: "Due tomorrow", tone: "amber" };
  if (days <= 7) return { text: `Due in ${days} days`, tone: "blue" };
  return { text: `Due ${formatShortDate(value)}`, tone: "gray" };
};

// "Wednesday, October 14"
export const formatToday = () =>
  new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" });

// "October"
export const currentMonthName = () => new Date().toLocaleDateString("en-PH", { month: "long" });

// Days left in the current month, counting today (October 14 -> 18)
export const daysLeftInMonth = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); // day 0 of next month = last day of this one
  return daysInMonth - now.getDate() + 1;
};

// "Juan Dela Cruz" -> "JD"
export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
