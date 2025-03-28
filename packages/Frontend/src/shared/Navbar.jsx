import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

function Navbar() {
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed top-0 left-64 right-0 z-10">
      <h4 className="text-xl font-semibold text-gray-800">Explore</h4>
      
      <div className="flex items-center gap-4">
        <Button
          variant="contained"
          onClick={handleLogout}
          disabled={isLoading}
          className="!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-lx !transition-colors !shadow-sm"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;