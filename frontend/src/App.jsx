// frontend/src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import Tasks from "./pages/Tasks";
import Expenses from "./pages/Expenses";

function App() {
  return (
    <Routes>
      {/* Logged-out pages: no sidebar */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* A "layout route": it has no path of its own. Every page inside it
          requires login and is drawn inside AppLayout (sidebar + page). */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/expenses" element={<Expenses />} />
      </Route>

      {/* "/" and any unknown URL go to the dashboard (which sends you to /login if needed) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
