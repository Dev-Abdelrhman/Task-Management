import React from "react";
import { toast } from "react-toastify";
import {
  Box,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Bell, Mail } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useAuth } from "../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { getNavTitle } from "../lib/getNavTitle";

function Navbar() {
  const { signOut, isLoading } = useAuth();
  const { user } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };
  const path = window.location.pathname;
  const navTitle = getNavTitle(path);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&w=200&h=200`;
  };
  return (
    <>
      <nav className="flex justify-end sm:justify-between items-center bg-white dark:bg-[#080808] dark:text-white px-6 py-4 fixed w-full top-0 sm:first-line:left-64 right-0 z-10">
        <h4 className="hidden sm:flex ml-[15rem] text-3xl px-6 py-5 dark:bg-[#080808] dark:text-white bg-white">
          {navTitle}
        </h4>

        <Box
          className="!flex gap-5"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            className="!border-[1px] !border-[#F5F5F7]"
          >
            <Badge badgeContent={0} color="error">
              <Mail className="text-[#8E92BC]" />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            className="!border-[1px] !border-[#F5F5F7]"
          >
            <Badge badgeContent={1} color="error">
              <Bell className="text-[#8E92BC]" />
            </Badge>
          </IconButton>

          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                className="!w-12 !h-12"
                src={
                  user.image?.length
                    ? user.image[0].url.startsWith("data:")
                      ? user.image[0].url // use DataURL directly for instant preview
                      : hostGoogleImage(user.image[0].url) // use CDN for remote images
                    : undefined
                }
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "53px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              key="settings"
              onClick={() => navigate("/Settings")}
              disabled={isLoading}
            >
              <Typography sx={{ textAlign: "center" }}>Settings</Typography>
            </MenuItem>
            <MenuItem key="logout" onClick={handleLogout} disabled={isLoading}>
              <Typography sx={{ textAlign: "center" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </nav>
    </>
  );
}

export default Navbar;
