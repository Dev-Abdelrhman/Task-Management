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
    <nav className="text-center navbar bg-dark text-white p-3">
      <h3 className="">Welcome to Home</h3>
    </nav>
  );
};

export default Dashboard;