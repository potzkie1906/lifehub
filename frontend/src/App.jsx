import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import Tasks from "./pages/Tasks";
import Expenses from "./pages/Expenses";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-paper min-h-screen">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;