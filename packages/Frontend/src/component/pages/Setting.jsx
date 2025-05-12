import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { CircularProgress, Button, Avatar } from "@mui/material";
import { Trash, Upload, X } from "lucide-react";
import { useUser } from "../../hooks/useUserInfo";
import { useAuthStore } from "../../stores/authStore";

export default function Setting() {
  const {
    updateUser,
    removeImage,
    isRemovingImage,
    useProfileUser,
    isUpdating: isUserUpdating,
    updatePassword: updateUserPassword,
  } = useUser();
  const { user } = useAuthStore();

  const { data: userProfile } = useProfileUser();
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState("light");
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirmation: "",
  });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    image: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image || [],
      });
      if (user.image?.[0]?.url) {
        setImagePreview(user.image[0].url);
      } else {
        setImagePreview(null);
      }
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (!userData.image?.[0]?.public_id) return;

    try {
      await removeImage({
        userID: user?._id,
        public_id: userData.image[0].public_id,
      });
      setImagePreview(null);
      setUserData((prev) => ({ ...prev, image: [] }));
      toast.success("Profile image removed");
      setShowImageModal(false);
    } catch (err) {
      toast.error("Failed to remove image");
    }
  };

  const handleUpdateImage = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("username", userData.username);

    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    } else if (!imagePreview) {
      toast.error("Please select an image first");
      return;
    }

    try {
      await updateUser(formData);
      toast.success("Profile image updated successfully");
      setShowImageModal(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile image"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async () => {
    const { passwordCurrent, password, passwordConfirmation } = passwordData;

    if (password !== passwordConfirmation) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await updateUserPassword({
        passwordCurrent,
        password,
        passwordConfirmation,
      });
      toast.success("Password updated successfully");
      setPasswordData({
        passwordCurrent: "",
        password: "",
        passwordConfirmation: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      await updateUser({
        name: userData.name,
        email: userData.email,
        username: userData.username,
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white dark:bg-[#080808]">
      {/* Image Update Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#080808] rounded-lg shadow-md p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-gray-200">
                Update Profile Picture
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden relative border-2 border-gray-200 dark:border-gray-600">
                <Avatar
                  src={imagePreview}
                  alt="Profile preview"
                  className="!w-full !h-full object-cover"
                />
              </div>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
              <Button
                onClick={() => fileInputRef.current.click()}
                className="w-full !capitalize !text-base !text-white !py-2 hover- !bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#546FFF]"
                startIcon={<Upload className="w-4 h-4 !text-base" />}
              >
                Select Image
              </Button>

              {userData.image?.length > 0 && (
                <Button
                  onClick={handleRemoveImage}
                  className="w-full !capitalize !text-base !text-white !py-2 !bg-red-600 hover:!bg-red-500 hover:!shadow-lg hover:!shadow-red-400"
                  startIcon={<Trash className="w-4 h-4" />}
                  disabled={isRemovingImage}
                >
                  {isRemovingImage ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Remove Image"
                  )}
                </Button>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowImageModal(false)}
                variant="outlined"
                className="dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateImage}
                variant="contained"
                className="!bg-[#546FFF]"
                disabled={isRemovingImage || !imagePreview}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex border-b dark:border-0 ml-2 mb-6 bg-white dark:bg-[#080808]">
        <button
          className={`px-4 py-3 text-sm font-medium relative ${
            activeTab === "general"
              ? "text-indigo-600 dark:text-indigo-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium relative ${
            activeTab === "notifications"
              ? "text-indigo-600 dark:text-indigo-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notification
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium relative ${
            activeTab === "security"
              ? "text-indigo-600 dark:text-indigo-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("security")}
        >
          Security & Privacy
        </button>
      </div>

      {activeTab === "general" && (
        <div className="bg-white dark:bg-[#080808] dark:text-[#e0e0e0] rounded-lg shadow p-6 space-y-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <section className="w-full lg:w-1/2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                🛠️ Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
                  >
                    Change name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userData.name || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
                  >
                    Change User Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={userData.username || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden relative cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                      onClick={() => setShowImageModal(true)}
                    >
                      <Avatar
                        src={imagePreview}
                        alt="Profile"
                        className="!w-full !h-full object-cover"
                      />
                    </div>
                    <Button
                      onClick={() => setShowImageModal(true)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white"
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
                  >
                    Change email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userData.email || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Theme
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Light
                    </span>
                    <label className="relative inline-block w-11 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === "dark"}
                        onChange={() => {
                          const newTheme = theme === "light" ? "dark" : "light";
                          setTheme(newTheme);
                          localStorage.setItem("theme", newTheme);
                          document.documentElement.classList.toggle(
                            "dark",
                            newTheme === "dark"
                          );
                        }}
                      />
                      <div className="peer-checked:bg-indigo-600 bg-gray-300 rounded-full w-11 h-6 transition-all"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Dark
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateUserInfo}
              className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
              disabled={isUserUpdating}
            >
              {isUserUpdating ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-[#080808] dark:text-[#e0e0e0] rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Notification Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Configure your notification preferences here.
          </p>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#080808] dark:text-[#e0e0e0] rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Security Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Configure your security settings here.
          </p>

          <div className="mt-4">
            <label
              htmlFor="passwordCurrent"
              className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
            >
              Current password
            </label>
            <input
              type="password"
              name="passwordCurrent"
              value={passwordData.passwordCurrent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded text-sm"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={passwordData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded text-sm"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              name="passwordConfirmation"
              value={passwordData.passwordConfirmation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded text-sm"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleUpdatePassword}
              className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
