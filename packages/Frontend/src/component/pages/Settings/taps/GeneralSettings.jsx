import { Button, Avatar, CircularProgress } from "@mui/material";

const GeneralSettings = ({
  userData,
  setUserData,
  imagePreview,
  setShowImageModal,
  handleUpdateUserInfo,
  isUserUpdating,
  theme,
  setTheme,
}) => {
  return (
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
                className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
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
                className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
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
                className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex-col items-center justify-between">
              <label className="text-sm text-gray-600 dark:text-gray-300">
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
  );
};

export default GeneralSettings;
