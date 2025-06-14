import { Button } from "@mui/material";

const RoleModal = ({
  open,
  onClose,
  isEditing,
  newRole,
  onInputChange,
  onPermissionChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="dark:bg-[#080808] bg-white !rounded-xl p-6 w-[500px]">
        <h2 className="text-2xl dark:text-gray-400 text-center font-medium mb-6">
          {isEditing ? "Edit Role" : "Create Role"}
        </h2>

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block dark:text-gray-400 text-sm font-medium mb-2 text-gray-700">
              ROLE NAME
            </label>
            <input
              type="text"
              name="name"
              value={newRole.name}
              onChange={onInputChange}
              placeholder="Enter role name"
              className="dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 w-full p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block dark:text-gray-400 text-sm font-medium mb-2 text-gray-700">
              ROLE COLOR
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                value={newRole.color}
                onChange={onInputChange}
                className="w-9 h-9 cursor-pointer dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300"
              />
              <input
                type="text"
                name="color"
                value={newRole.color}
                onChange={onInputChange}
                className="dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 w-32 p-2 border rounded-xl text-sm"
                placeholder="Hex color code"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-400">
                PERMISSIONS
              </h3>
              <button
                type="button"
                onClick={() =>
                  onInputChange({ target: { name: "permissions", value: [] } })
                }
                className="text-xs text-blue-600 dark:text-gray-400 hover:text-blue-800"
              >
                Clear permissions
              </button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              <div className="bg-gray-50 dark:bg-[#2D2D2D] p-3 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">
                  SERVER PERMISSIONS
                </h4>

                {[
                  {
                    value: "Read",
                    label: "Read Access",
                    description: "Allows viewing content and information",
                  },
                  {
                    value: "Add",
                    label: "Add Content",
                    description: "Allows creating new content and entries",
                  },
                  {
                    value: "Delete",
                    label: "Delete Content",
                    description: "Allows removing content and entries",
                  },
                  {
                    value: "Edit",
                    label: "Edit Content",
                    description: "Allows modifying existing content",
                  },
                  {
                    value: "Admin",
                    label: "Administrator",
                    description: "Full access to all permissions",
                  },
                ].map((perm) => (
                  <div
                    key={perm.value}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <div className="flex-1 mr-4">
                      <div className="dark:text-gray-500 text-sm font-medium text-gray-900">
                        {perm.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {perm.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPermissionChange(perm.value)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        newRole.permissions.includes(perm.value)
                          ? "bg-[#546FFF]"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          newRole.permissions.includes(perm.value)
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 border-t pt-4">
            <Button
              onClick={onClose}
              className="!text-base !py-2 !capitalize !bg-[#f83131] hover:shadow-lg hover:shadow-red-700 !font-medium !text-white !rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="!text-base !py-2 !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-medium !text-white !rounded-[10px]"
            >
              {isEditing ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
