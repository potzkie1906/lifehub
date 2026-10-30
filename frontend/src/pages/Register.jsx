// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, Lock, Mail, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import SocialLogin from "../components/SocialLogin";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Make sure the server is running.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Keep your classes, to-dos, and allowance in one place.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert>{error}</Alert>}

        <Input
          label="Username"
          icon={UserRound}
          placeholder="Choose a username"
          autoComplete="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <LoaderCircle size={18} className="animate-spin" />}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
