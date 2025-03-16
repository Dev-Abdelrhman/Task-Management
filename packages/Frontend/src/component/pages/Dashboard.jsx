import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/home");
    } catch (error) {
      toast.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="navbar bg-dark text-white p-3">
      <h3>Welcome to Home</h3>
      <button 
        className="btn btn-danger" 
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
};

export default Dashboard;