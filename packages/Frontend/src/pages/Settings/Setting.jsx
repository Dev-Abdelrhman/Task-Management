import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "../../hooks/users/useUserInfo";
import { useAuthStore } from "../../stores/authStore";
import ImageUpdateModal from "./components/modals/ImageUpdateModal";
import GeneralSettings from "./components/taps/GeneralSettings";
import SecuritySettings from "./components/taps/SecuritySettings";
import NotificationSettings from "./components/taps/NotificationSettings";
import DeleteUserModal from "./components/modals/DeleteUserModal";
import { getNavTitle } from "../../lib/getNavTitle";

export default function Setting() {
  const {
    updateUser,
    removeImage,
    isRemovingImage,
    isUpdating: isUserUpdating,
    updatePassword: updateUserPassword,
    deleteUser,
    isDeleting,
  } = useUser();
  const { user, setUser } = useAuthStore();

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
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const fileInputRef = useRef(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const path = window.location.pathname;
  const title = getNavTitle(path);

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
        setUserData((prev) => ({
          ...prev,
          image: [{ url: reader.result }], // update local state for instant UI
        }));
        setUser({
          ...user,
          image: [{ url: reader.result }], // update zustand and localStorage for instant update
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    // If there is a public_id, call the backend to remove it
    if (userData.image?.[0]?.public_id) {
      try {
        await removeImage({
          userID: user?._id,
          public_id: userData.image[0].public_id,
        });
      } catch {
        toast.error("Failed to remove image");
        return;
      }
    }
    // Always clear the image locally
    setImagePreview(null);
    setUserData((prev) => ({ ...prev, image: [] }));
    setUser({ ...user, image: [] });
    setShowImageModal(false);
  };

  const handleUpdateImage = async () => {
    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("username", userData.username);

    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    } else if (!imagePreview) {
      toast.error("Please select an image first");
      setIsImageUploading(false);
      return;
    }

    try {
      await updateUser(formData);
      setShowImageModal(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile image",
      );
    } finally {
      setIsImageUploading(false);
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteUser = async () => {
    await deleteUser();
  };

  return (
    <>
      <h4 className="sm:hidden text-3xl px-6 pb-3 pt-2 dark:bg-[#080808] dark:text-white bg-white">
        {title}
      </h4>
      <div className="bg-white dark:bg-[#080808]">
        <ImageUpdateModal
          showImageModal={showImageModal}
          setShowImageModal={setShowImageModal}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          handleUpdateImage={handleUpdateImage}
          isRemovingImage={isRemovingImage}
          userData={userData}
          isImageUploading={isImageUploading}
          handleDeleteUser={handleDeleteUser}
        />
        <DeleteUserModal
          showModal={showDeleteUserModal}
          onClose={() => setShowDeleteUserModal(false)}
          onConfirm={handleDeleteUser}
          isDeleting={isDeleting}
          user={user}
        />

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
          <GeneralSettings
            userData={userData}
            setUserData={setUserData}
            imagePreview={imagePreview}
            setShowImageModal={setShowImageModal}
            handleUpdateUserInfo={handleUpdateUserInfo}
            isUserUpdating={isUserUpdating}
            theme={theme}
            setTheme={setTheme}
          />
        )}

        {activeTab === "notifications" && <NotificationSettings />}

        {activeTab === "security" && (
          <SecuritySettings
            passwordData={passwordData}
            handleInputChange={handleInputChange}
            handleUpdatePassword={handleUpdatePassword}
            handleDeleteUser={() => setShowDeleteUserModal(true)}
          />
        )}
      </div>
    </>
  );
}
