// frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import SocialLogin from "../components/SocialLogin";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false); // true while waiting for the server
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't log in. Make sure the server is running.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see what's due and what's left in your budget.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert>{error}</Alert>}

        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="-mt-2 flex justify-end">
          <Link to="/reset-password" className="text-sm font-medium text-brand hover:underline">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle size={18} className="animate-spin" />}
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-slate-600">
        New to LifeHub?{" "}
        <Link to="/register" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
