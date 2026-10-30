// frontend/src/utils/categories.js
import { Bus, Clapperboard, GraduationCap, Receipt, Shapes, Utensils } from "lucide-react";

// The expense categories, each with an icon and colors.
// The names match the ones already saved in your expenses table.
export const CATEGORIES = [
  { name: "Food", icon: Utensils, tile: "bg-orange-100 text-orange-700", bar: "bg-orange-400" },
  { name: "Transportation", icon: Bus, tile: "bg-sky-100 text-sky-700", bar: "bg-sky-500" },
  { name: "School", icon: GraduationCap, tile: "bg-blue-100 text-blue-700", bar: "bg-brand" },
  { name: "Bills", icon: Receipt, tile: "bg-rose-100 text-rose-700", bar: "bg-rose-400" },
  { name: "Entertainment", icon: Clapperboard, tile: "bg-violet-100 text-violet-700", bar: "bg-violet-400" },
  { name: "Other", icon: Shapes, tile: "bg-slate-100 text-slate-600", bar: "bg-slate-400" },
];

// Look up a category by name; anything unknown is treated as "Other"
export const categoryInfo = (name) =>
  CATEGORIES.find((category) => category.name === name) || CATEGORIES[CATEGORIES.length - 1];
