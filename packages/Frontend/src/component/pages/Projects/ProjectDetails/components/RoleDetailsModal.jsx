import { Button, CircularProgress, Chip } from "@mui/material";

const RoleDetailsModal = ({ open, onClose, role, isLoading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#080808] !rounded-xl p-6 w-[90%] sm:w-[500px]">
        <h2 className="text-xl font-medium mb-4 dark:text-gray-400">
          Role Details
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : (
          role && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">
                  Role Name
                </label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-xl dark:bg-[#2D2D2D] dark:text-gray-300">
                  {role.doc?.name || "N/A"}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">
                  Role Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border dark:border-gray-500"
                    style={{ backgroundColor: role.doc.color }}
                  />
                  <p className="text-gray-900 dark:text-gray-300">
                    {role.doc.color}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400">
                  Permissions
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {role?.doc.permissions?.map((permission) => (
                    <Chip
                      key={permission}
                      label={permission}
                      className="!capitalize !px-2 font-medium !bg-[#546FFF] !text-white"
                      size="small"
                      sx={{
                        "&.MuiChip-root": {
                          height: 28,
                          margin: "2px",
                          backgroundColor: "#546FFF",
                          color: "white",
                        },
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )
        )}

        <Button
          onClick={onClose}
          className="!mt-4 !w-full !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !text-white !rounded-xl"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default RoleDetailsModal;
