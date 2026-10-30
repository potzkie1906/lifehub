// frontend/src/components/AuthLayout.jsx
import { Check } from "lucide-react";
import Logo from "./Logo";

// What's "written" on the pad-paper sheet: a peek at what LifeHub keeps track of
const NOTES = [
  { text: "Submit Java OOP activity", done: true },
  { text: "Review IM chapter 3", done: false },
  { text: "Print Web Dev mockup, ₱40", done: false },
];

// Shared layout for Login and Register:
// a dark "desk" with a sheet of pad paper on the left, the form on the right.
// On phones only the form shows.
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="grid min-h-screen bg-white lg:grid-cols-[1.1fr_1fr]">
    <div className="hidden flex-col bg-ink p-10 lg:flex">
      <Logo />

      <div className="flex flex-1 items-center justify-center py-10" aria-hidden="true">
        {/* The sheet. Text uses 36px lines (leading-9 / h-9) so it sits on the ruled lines. */}
        <div className="pad-paper relative w-full max-w-md -rotate-2 rounded-md pb-9 pt-[72px] shadow-2xl shadow-black/40">
          <div className="absolute inset-y-0 left-14 w-px bg-danger/60" />
          <div className="pl-[4.5rem] pr-8">
            <p className="text-3xl font-extrabold leading-9 tracking-tight text-ink">
              Every deadline, to-do, and peso on one page.
            </p>
            <ul className="mt-9 text-[17px] text-slate-700">
              {NOTES.map((note) => (
                <li key={note.text} className="flex h-9 items-center gap-3">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                      note.done ? "border-brand bg-brand text-white" : "border-slate-300"
                    }`}
                  >
                    {note.done && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={note.done ? "text-slate-400 line-through" : ""}>{note.text}</span>
                </li>
              ))}
              <li className="flex h-9 items-center">
                <span className="rounded-sm bg-highlight px-1 font-semibold text-ink">₱1,760 left this month</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <main className="flex items-center justify-center px-6 py-12 sm:px-10">
      <div className="w-full max-w-sm">
        <Logo tone="dark" className="mb-10 lg:hidden" />
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  </div>
);

export default AuthLayout;
