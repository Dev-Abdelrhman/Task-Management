import {
  Button,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Send, MoreVertical, MessageCircle, Check } from "lucide-react";
import { DateTime } from "luxon";
import { useComments } from "../../../../../hooks/features/useComments";
import { useState } from "react";

const hostGoogleImage = (url) => {
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=200&h=200`;
};

const Comments = ({ userId, projectId, user }) => {
  const {
    commentText,
    setCommentText,
    showComments,
    setShowComments,
    anchorEl,
    selectedCommentId,
    commentsData,
    commentsLoading,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    handleCommentSubmit,
    handleMenuOpen,
    handleMenuClose,
    handleDeleteComment,
    editingCommentId,
    setEditingCommentId,
  } = useComments(userId, projectId, user);

  // Separate state for the inline edit input
  const [editText, setEditText] = useState("");

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.comment); // set the inline edit value
    handleMenuClose();
  };

  const handleEditSubmit = (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    updateCommentMutation.mutate({
      commentId,
      commentData: { comment: editText },
    });

    setEditingCommentId(null);
    setEditText("");
  };

  return (
    <div className="px-4 lg:px-0 lg:ml-16 pt-2">
      {/* Main input always visible */}
      <Button
        onClick={() => setShowComments(!showComments)}
        className="!text-sm sm:!text-base !capitalize !bg-[#546FFF] !text-white !rounded-xl !mt-2 !mb-6 sm:!mb-3 !px-4 sm:!px-6 !py-2 sm:!py-3 !w-full sm:!w-auto"
      >
        <MessageCircle />
      </Button>

      {showComments && (
        <div className="mt-4 mb-32">
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex items-center gap-2">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="rounded-xl dark:bg-white"
              />
              <Button
                type="submit"
                disabled={
                  !commentText.trim() || createCommentMutation.isLoading
                }
                className="!bg-[#546FFF] disabled:!bg-[#b7c2fb] !p-4 sm:!p-3 !text-white !rounded-xl"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </form>

          {commentsLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="space-y-4">
              {commentsData?.doc?.map((comment) => (
                <div key={comment._id} className="flex gap-3 items-start">
                  <Avatar
                    className="!w-8 !h-8 sm:!w-10 sm:!h-10"
                    src={
                      comment.user?.image?.length
                        ? hostGoogleImage(comment.user.image[0].url)
                        : undefined
                    }
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap itms-center gap-2">
                      <span className="text-gray-800 font-semibold text-xs sm:text-base truncate">
                        <span className="text-lg">@</span>
                        {comment.user?.name.toLowerCase().replace(/\s+/g, "")}
                      </span>

                      <span className="text-xs sm:text-sm mt-1 text-gray-500 whitespace-nowrap">
                        {DateTime.fromISO(comment.createdAt).toRelative()}
                      </span>

                      {comment.user._id === user._id && (
                        <div className="ml-auto">
                          <Button
                            onClick={(e) => handleMenuOpen(e, comment._id)}
                            className="!text-black !text-sm !rounded-full !p-2 sm:!p-1 !hover:bg-gray-200"
                          >
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>

                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) &&
                              selectedCommentId === comment._id
                            }
                            onClose={handleMenuClose}
                            className="!mt-2 !rounded-xl"
                          >
                            <MenuItem onClick={() => handleEditClick(comment)}>
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={handleDeleteComment}
                              disabled={deleteCommentMutation.isLoading}
                              className="!text-red-500"
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </div>

                    {/* Inline edit input appears only if this comment is being edited */}
                    {editingCommentId === comment._id ? (
                      <form
                        onSubmit={(e) => handleEditSubmit(e, comment._id)}
                        className="flex items-center gap-2 mt-1"
                      >
                        <TextField
                          fullWidth
                          size="small"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="rounded-xl"
                        />
                        <Button
                          type="submit"
                          className="!bg-[#546FFF] !p-2 !rounded-xl !text-white"
                          disabled={updateCommentMutation.isLoading}
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                      </form>
                    ) : (
                      <p className="text-gray-800 text-xs sm:text-[15px] ml-2 mt-1 break-words">
                        {comment.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
