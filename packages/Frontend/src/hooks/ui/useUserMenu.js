import { useState, useCallback } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useAuth } from "../../pages/auth/hooks/useAuth";
import { toast } from "react-toastify";

export const useUserMenu = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user } = useAuthStore();
  const { signOut } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  }, [signOut]);

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  return {
    anchorElUser,
    handleLogout,
    handleOpenUserMenu,
    handleCloseUserMenu,
    user,
  };
};
