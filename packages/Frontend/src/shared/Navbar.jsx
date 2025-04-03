import React, { useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import {
  Button,
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
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { signOut, isLoading } = useAuth();
  const { user } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&w=200&h=200`;
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <>
      <nav className="flex justify-between items-center bg-white px-6 py-4 fixed top-0 left-64 right-0 z-10">
        <h4 className="text-2xl font-medium !text-[##53577A]-800">
          Hi, {user.username}
        </h4>

        <Box
          className="!flex gap-5"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
            className="!bg-[#F5F5F7]"
          >
            <Badge cla badgeContent={0} color="error">
              <Mail className="text-[#8E92BC]" />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            className="!bg-[#F5F5F7]"
          >
            <Badge badgeContent={1} color="error">
              <Bell className="text-[#8E92BC]" />
            </Badge>
          </IconButton>

          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                className="!w-12 !h-auto"
                src={hostGoogleImage(user.image)}
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
