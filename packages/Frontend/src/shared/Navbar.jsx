import React, { useState } from "react";
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
import { Bell, Mail, X } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { signOut, isLoading } = useAuth();
  const { user } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setAnchorElUser(null);
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  let title = "";
  if (window.location.pathname === "/projects") {
    title = "Explore Project";
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=200&h=200`;
  };

  return (
    <nav className="flex justify-between items-center bg-white dark:bg-[#121212] dark:text-white px-4 sm:px-6 lg:px-8 py-4 fixed top-0 left-0 md:left-64 right-0 z-10">
      {/* Title */}
      <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold">{title}</h4>

      {/* Desktop Menu */}
      <Box className="hidden md:flex items-center gap-4">
        <IconButton
          size="large"
          aria-label="show new mails"
          className="!border-[1px] !border-[#F5F5F7] !rounded-full"
        >
          <Badge badgeContent={0} color="error">
            <Mail className="text-[#8E92BC] h-5 w-5" />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-label="show new notifications"
          className="!border-[1px] !border-[#F5F5F7] !rounded-full"
        >
          <Badge badgeContent={1} color="error">
            <Bell className="text-[#8E92BC] h-5 w-5" />
          </Badge>
        </IconButton>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              className="!w-10 !h-10 sm:!w-12 sm:!h-12"
              src={
                user.image.length
                  ? hostGoogleImage(user.image[0].url)
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
          <MenuItem key="logout" onClick={handleLogout} disabled={isLoading}>
            <Typography sx={{ textAlign: "center" }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <IconButton
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="!text-[#8E92BC]"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </IconButton>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-[#121212] shadow-lg p-4 md:hidden z-20">
          <Box className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Avatar
                className="!w-10 !h-10"
                src={
                  user.image.length
                    ? hostGoogleImage(user.image[0].url)
                    : undefined
                }
              />
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                className="!capitalize !text-[#141522] dark:!text-white !text-sm"
              >
                Logout
              </Button>
            </div>
            <div className="flex gap-4 justify-center">
              <IconButton
                size="large"
                aria-label="show new mails"
                className="!border-[1px] !border-[#F5F5F7] !rounded-full"
              >
                <Badge badgeContent={0} color="error">
                  <Mail className="text-[#8E92BC] h-5 w-5" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show new notifications"
                className="!border-[1px] !border-[#F5F5F7] !rounded-full"
              >
                <Badge badgeContent={1} color="error">
                  <Bell className="text-[#8E92BC] h-5 w-5" />
                </Badge>
              </IconButton>
            </div>
          </Box>
        </div>
      )}
    </nav>
  );
}

export default Navbar;