import { useState } from "react";
import { Button, Avatar, CircularProgress } from "@mui/material";
import { Search, X } from "lucide-react";
import { useInvite } from "../../../hooks/useInvite";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const InviteModal = ({ projectId, open, onClose, roles }) => {
  const { user } = useAuth();
  const { searchUser, sendInvite, isSearching, isSending } = useInvite();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setHasSearched(true);
      const results = await searchUser({
        userId: user._id,
        username: searchQuery.trim(),
      });

      if (results?.data?.length > 0) {
        setSearchResults(results.data);
      } else {
        setSearchResults([]);
        toast.info("No users found matching your search");
      }
    } catch (error) {
      setSearchResults([]);
      if (error?.response?.status !== 404) {
        toast.error(error?.response?.data?.message || "Search failed");
      }
    }
  };

  const handleSendInvite = async () => {
    if (!selectedUser || !selectedRoleId) {
      toast.error("Please select a user and role");
      return;
    }

    try {
      await sendInvite({
        userId: user._id,
        projectId,
        inviteData: {
          username: selectedUser.username,
          roleId: selectedRoleId, // Now using the role ID
        },
      });
      onClose();
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send invite");
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setSelectedRoleId("");
    setHasSearched(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        !open && "hidden"
      }`}
    >
      <div className="bg-white rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Invite Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 w-full">
          <label className="text-base font-medium">Search Users</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter username"
              className="flex-1 pl-4 pr-4 py-2 border border-gray-200 !rounded-[10px] text-lg !font-light focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="!text-sm !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
            >
              Search
              {isSearching && (
                <CircularProgress size={20} sx={{ color: "white", ml: 1 }} />
              )}
            </Button>
          </div>
        </div>

        {isSearching ? (
          <div className="flex justify-center py-4">
            <CircularProgress size={24} />
          </div>
        ) : hasSearched && searchResults.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No matching users found
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer ${
                    selectedUser?._id === user._id
                      ? "bg-gray-100 border border-gray-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar
                    src={user.image?.[0]?.url}
                    className="!w-8 !h-8 !mr-2"
                  />
                  <div>
                    <p className="text-md font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {selectedUser && (
          <div className="mb-4">
            <label className="block  font-medium mb-2">Select Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a role</option>
              {roles?.doc?.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              onClose();
              resetForm();
            }}
            variant="outlined"
            className="!text-sm !rounded-xl !capitalize !border-gray-300 !text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={!selectedUser || !selectedRoleId || isSending}
            className="!text-sm !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl disabled:!bg-[#BAC8FF]"
          >
            {isSending ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Send Invite"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
