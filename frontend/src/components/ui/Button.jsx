// frontend/src/components/ui/Button.jsx
import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-brand text-white shadow-card hover:bg-brand-dark",
  secondary: "border border-line bg-white text-ink shadow-card hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
  ghostDanger: "text-slate-400 hover:bg-red-50 hover:text-danger", // quiet delete buttons
};

const SIZES = {
  md: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
  icon: "h-9 w-9", // square button that only holds an icon
};

// One button style for the whole app.
//   <Button>Save</Button>                        -> blue button
//   <Button variant="secondary" to="/tasks">     -> a <Link> that looks like a button
//
// It uses type="button" by default so it never submits a form by accident.
// Pass type="submit" on the one button that should submit the form.
const Button = ({ variant = "primary", size = "md", to, type = "button", className = "", children, ...props }) => {
  const classes = `inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
