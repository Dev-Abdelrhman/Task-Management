import { Bell, Mail } from "lucide-react";
import {
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useUserMenu } from "../../../hooks/ui/useUserMenu";

const DashboardNav = () => {
  const {
    anchorElUser,
    handleLogout,
    handleOpenUserMenu,
    handleCloseUserMenu,
    user,
  } = useUserMenu();

  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&w=200&h=200`;
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl dark:text-white">Hi, {user.name}</h1>
        <p className="text-gray-600 dark:text-[#a0a0a0]">
          Let's finish your task today!
        </p>
      </div>
      <div className="flex items-center gap-4 ">
        <IconButton
          sx={{
            border: 1,
          }}
          size="large"
          color="inherit"
          className="w-12 h-12 !border !border-[#F5F5F7] dark:!border-0"
        >
          <Badge badgeContent={1} color="error">
            <Mail className="text-[#8E92BC]" />
          </Badge>
        </IconButton>
        <IconButton
          sx={{
            border: 1,
          }}
          className="relative w-12 h-12 !border !border-[#F5F5F7] dark:!border-0 !rounded-full"
        >
          <Badge badgeContent={1} color="error">
            <Bell className="text-[#8E92BC]" />
          </Badge>
        </IconButton>
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                className="!w-12 !h-12 select-none"
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
            <MenuItem key="logout" onClick={handleLogout}>
              <Typography sx={{ textAlign: "center" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
