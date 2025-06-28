import { Button } from "@mui/material";

const SecuritySettings = ({
  passwordData,
  handleInputChange,
  handleUpdatePassword,
  handleDeleteUser,
}) => {
  return (
    <div className="bg-white dark:bg-[#080808] dark:text-[#e0e0e0] rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        Security Settings
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Configure your security settings here.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="passwordCurrent"
            className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
          >
            Current password
          </label>
          <input
            type="password"
            id="passwordCurrent"
            name="passwordCurrent"
            value={passwordData.passwordCurrent}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={passwordData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="passwordConfirmation"
            className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={passwordData.passwordConfirmation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button
          onClick={handleUpdatePassword}
          className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
        >
          Save Changes
        </Button>
        <Button
          onClick={handleDeleteUser}
          className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"
        >
          Delete account
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
