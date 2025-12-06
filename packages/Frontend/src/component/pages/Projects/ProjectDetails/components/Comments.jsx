import {
  Button,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Send, MoreVertical } from "lucide-react";
import { DateTime } from "luxon";
import { useComments } from "../../../../../hooks/features/useComments";

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
    replies,
    replyText,
    setReplyText,
    replyingToCommentId,
    setReplyingToCommentId,
    commentsData,
    commentsLoading,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    handleCommentSubmit,
    handleMenuOpen,
    handleMenuClose,
    handleEditComment,
    handleDeleteComment,
  } = useComments(userId, projectId, user);

  return (
    <div className="px-4 lg:px-0 lg:ml-16 pt-4">
      <Button
        onClick={() => setShowComments(!showComments)}
        className="!text-sm sm:!text-base !capitalize !bg-[#546FFF] !text-white !rounded-xl !mt-2 !mb-6 sm:!mb-10 !px-4 sm:!px-6 !py-2 sm:!py-3 !w-full sm:!w-auto"
      >
        {showComments ? "Hide Comments" : "+ Comment"}
      </Button>
      {showComments && (
        <div className="mt-4 mb-10">
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex items-center gap-2">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={
                  replyingToCommentId
                    ? `reply to the comment...`
                    : "Add a comment..."
                }
                value={replyingToCommentId ? replyText : commentText}
                onChange={(e) =>
                  replyingToCommentId
                    ? setReplyText(e.target.value)
                    : setCommentText(e.target.value)
                }
                className="rounded-xl dark:bg-white"
              />
              <Button
                type="submit"
                disabled={
                  (!commentText.trim() && !replyText.trim()) ||
                  createCommentMutation.isLoading ||
                  updateCommentMutation.isLoading
                }
                className="!bg-[#546FFF] !p-3 sm:!p-4 !text-white !rounded-xl"
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-gray-800 font-semibold dark:text-[#a0a0a0] text-xs sm:text-sm truncate">
                        @{comment.user?.name.toLowerCase().replace(/\s+/g, "")}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {DateTime.fromISO(comment.createdAt).toRelative()}
                      </span>
                      {comment.user._id === user._id && (
                        <div className="ml-auto">
                          <Button
                            onClick={(e) => handleMenuOpen(e, comment._id)}
                            className="!text-black !text-sm !rounded-full !p-1 sm:!p-2 !hover:bg-gray-200"
                          >
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-400" />
                          </Button>
                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) &&
                              selectedCommentId === comment._id
                            }
                            onClose={handleMenuClose}
                            PaperProps={{
                              sx: {
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                minWidth: "120px",
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => handleEditComment(comment)}
                              sx={{
                                color: "#546FFF",
                                fontSize: "13px",
                                padding: "6px 12px",
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={handleDeleteComment}
                              sx={{
                                color: "#DC2626",
                                fontSize: "13px",
                                padding: "6px 12px",
                              }}
                              disabled={deleteCommentMutation.isLoading}
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 text-xs sm:text-sm mt-1 break-words">
                      {comment.comment}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => {
                          setReplyingToCommentId(comment._id);
                          setReplyText("");
                        }}
                        className="text-gray-500 text-xs sm:text-sm hover:text-[#546FFF]"
                      >
                        Reply
                      </button>
                      {replies[comment._id]?.length > 0 && (
                        <span className="text-[#546FFF] text-xs sm:text-sm cursor-pointer">
                          {replies[comment._id].length} Replies
                        </span>
                      )}
                    </div>
                    {replies[comment._id] &&
                      replies[comment._id].length > 0 && (
                        <div className="ml-4 sm:ml-6 mt-2 space-y-2">
                          {replies[comment._id].map((reply, index) => (
                            <div
                              key={index}
                              className="flex gap-2 sm:gap-3 items-start"
                            >
                              <Avatar
                                className="!w-6 !h-6 sm:!w-8 sm:!h-8"
                                src={
                                  reply.user?.image?.length
                                    ? hostGoogleImage(reply.user.image[0].url)
                                    : undefined
                                }
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                  <span className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                                    @
                                    {reply.user?.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "")}
                                  </span>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {DateTime.fromISO(
                                      reply.createdAt
                                    ).toRelative()}
                                  </span>
                                </div>
                                <p className="text-gray-800 text-xs sm:text-sm mt-1 break-words">
                                  {reply.comment}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
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
