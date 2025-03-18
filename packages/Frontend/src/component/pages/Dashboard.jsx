import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  

  return ;
};

export default Dashboard;