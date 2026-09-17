import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <button onClick={logout} className="mt-4 bg-gray-200 px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;