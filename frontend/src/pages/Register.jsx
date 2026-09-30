import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {Eye, EyeOff} from "lucide-react";


const socialButtonStyle =
  "w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center transition-colors duration-200 focus:outline-slate-800";

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.805 12.23c0-.79-.065-1.56-.205-2.3H12v4.35h5.5a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.045-4.4 3.045-7.69Z"
      fill="#4285F4"
    />

    <path
      d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.56c-.92.62-2.1.99-3.47.99-2.67 0-4.94-1.8-5.75-4.23H2.84v2.64A10.22 10.22 0 0 0 12 22Z"
      fill="#34A853"
    />

    <path
      d="M6.25 13.73A6.14 6.14 0 0 1 5.93 12c0-.6.11-1.18.32-1.73V7.63H2.84A10.02 10.02 0 0 0 1.75 12c0 1.58.38 3.07 1.09 4.37l3.41-2.64Z"
      fill="#FBBC05"
    />

    <path
      d="M12 6.04c1.5 0 2.84.52 3.9 1.54l2.92-2.92C17.08 2.95 14.76 2 12 2a10.22 10.22 0 0 0-9.16 5.63l3.41 2.64C7.06 7.84 9.33 6.04 12 6.04Z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 12C24 5.37 18.63 0 12 0S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85v-8.39H7.08V12h3.05V9.41c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.46h-2.8v8.39C19.61 22.95 24 17.99 24 12Z"
      fill="#1877F2"
    />
  </svg>
);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded-lg text-xs focus-within:outline-slate-800"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg text-xs focus-within:outline-slate-800"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex items-center gap-2 relative w-full">
          <input
            className="w-full border p-2 rounded-lg text-xs focus-within:outline-slate-800"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="absolute inset-y-0 right-0 pr-3 text-gray-600 mt-1 flex items-center focus-within:outline-slate-800" type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button className="bg-slate-900 text-white text-sm p-2 rounded-3xl flex-1 focus-within:outline-slate-800" type="submit">
          Register
        </button>
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 "/>
            <span className="text-xs text-gray-400">Or continue with</span>
          <div className="h-px flex-1 bg-gray-200 "/>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className={socialButtonStyle}
            onClick={() => console.log("Google login")}
            aria-label="Login with Google"
            >
            <GoogleIcon />
          </button>

          <button
            type="button"
            className={socialButtonStyle}
            onClick={() => console.log("Facebook login")}
            aria-label="Login with Facebook"
            >
            <FacebookIcon />
          </button>
        </div>
      </form>
      <p className="mt-3 text-xs text-gray-400 flex items-center justify-center gap-2">
        Already have an account? <Link to="/login" className="text-slate-900 focus-within:outline-slate-800">Login</Link>
      </p>
    </div>
  );
};

export default Register;