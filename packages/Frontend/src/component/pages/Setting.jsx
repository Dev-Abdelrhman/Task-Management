import React, { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify"
import { getUserInfoForProfile, updateUserInfo, updateUserPassword } from "../../api/updateUserData";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");
  const [timeFormat, setTimeFormat] = useState("24hours");
  const [theme, setTheme] = useState("light");
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirmation: "",
  });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: ''
  });


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserInfoForProfile();
        setUserData({
          name: data.name,
          email: data.email,
          username: data.username,
        });
        console.log(data);

      } catch (err) {
        toast.error("Failed to fetch user info");
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  //   localStorage.setItem("theme", theme);
  // }, [theme]);


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

      // Clear fields
      setPasswordData({
        passwordCurrent: "",
        password: "",
        passwordConfirmation: "",
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update password";
      toast.error(message);
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      await updateUserInfo(userData);
      toast.success("Profile updated successfully");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  };




  return (
    <div>
      <div className="flex border-b mb-6 ">
        <button
          className={`px-4 py-3 text-sm font-medium relative ${activeTab === "general"
            ? "text-indigo-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium relative ${activeTab === "notifications"
            ? "text-indigo-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notification
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium relative ${activeTab === "security"
            ? "text-indigo-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("security")}
        >
          Security & Privacy
        </button>
      </div>

      {activeTab === "general" && (
        <div className="bg-white dark:bg-[#121212] dark:text-[#a0a0a0] rounded-lg shadow p-6 space-y-8 ">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <section className="w-full lg:w-1/2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-4">
                🛠️ Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Change name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userData.name || ""}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-500 rounded border-gray-300  text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Change User Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={userData.username || ""}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-500 rounded border-gray-300  text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
                    Update profile picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src="https://i.pinimg.com/736x/dc/ad/ef/dcadef86f8c41981f097080463089bb9.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 dark:text-gray-400">
                Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
                  >
                    Change email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userData.email || ""}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1">
                    Theme
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600  dark:text-[#a0a0a0]">
                      Light
                    </span>
                    <label className="relative inline-block w-11 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === "dark"}
                        onChange={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      />
                      <div className="peer-checked:bg-indigo-600 bg-gray-300 rounded-full w-11 h-6 transition-all"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                    <span className="text-sm text-gray-600  dark:text-[#a0a0a0]">
                      Dark
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="flex justify-end ">
            <Button onClick={handleUpdateUserInfo} className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-2">
            Notification Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-[#a0a0a0]">
            Configure your notification preferences here.
          </p>
        </div>
      )}
      {/* DONE */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#121212] rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400 mb-2">
            Security Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-[#a0a0a0]">
            Configure your security settings here.
          </p>

          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
            >
              Current password
            </label>
            <input
              type="password"
              name="passwordCurrent"
              value={passwordData.passwordCurrent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border  border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 dark:focus:border-red-500 rounded text-sm"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={passwordData.password}
              onChange={handleInputChange}

              className="w-full px-3 py-2 border  border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 dark:focus:border-red-500 rounded text-sm"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm text-gray-600  dark:text-[#a0a0a0] mb-1"
            >
              Password Confirmation
            </label>
            <input
              type="password"
              name="passwordConfirmation"
              value={passwordData.passwordConfirmation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-[#2D2D2D] dark:border-gray-500 rounded text-sm"
            />
          </div>
          {/* </div> */}
          <div className="flex justify-end mt-4">
            <Button onClick={handleUpdatePassword} className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
              Save Changes
            </Button>

          </div>








        </div>
      )
      }
    </div >
  );
}
