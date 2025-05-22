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
    handleReplySubmit,
    handleMenuOpen,
    handleMenuClose,
    handleEditComment,
    handleDeleteComment,
  } = useComments(userId, projectId);

  return (
    <div className="ml-16 pt-4">
      <Button
        onClick={() => setShowComments(!showComments)}
        className="!text-base !capitalize !bg-[#546FFF] !text-white !rounded-xl !mt-2 !mb-10 !px-6 !py-3"
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
                className="!bg-[#546FFF] !p-4 !text-white !rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
          {commentsLoading ? (
            <CircularProgress />
          ) : (
            <div className="space-y-4">
              {commentsData?.doc?.map((comment) => (
                <div key={comment._id} className="flex gap-3 items-start">
                  <Avatar
                    className="!w-10 !h-10"
                    src={
                      comment.user?.image?.length
                        ? hostGoogleImage(comment.user.image[0].url)
                        : undefined
                    }
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-semibold dark:text-[#a0a0a0] text-sm">
                        @{comment.user?.name.toLowerCase().replace(/\s+/g, "")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {DateTime.fromISO(comment.createdAt).toRelative()}
                      </span>
                      {comment.user._id === user._id && (
                        <div className="ml-auto">
                          <Button
                            onClick={(e) => handleMenuOpen(e, comment._id)}
                            className="!text-black !text-lg !rounded-full !p-2 !hover:bg-gray-200"
                          >
                            <MoreVertical className="w-5 h-5 dark:text-gray-400" />
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
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => handleEditComment(comment)}
                              sx={{
                                color: "#546FFF",
                                fontSize: "14px",
                                padding: "8px 16px",
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={handleDeleteComment}
                              sx={{
                                color: "#DC2626",
                                fontSize: "14px",
                                padding: "8px 16px",
                              }}
                              disabled={deleteCommentMutation.isLoading}
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 text-sm mt-1">
                      {comment.comment}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => {
                          setReplyingToCommentId(comment._id);
                          setReplyText("");
                        }}
                        className="text-gray-500 text-sm hover:text-[#546FFF]"
                      >
                        Reply
                      </button>
                      {replies[comment._id]?.length > 0 && (
                        <span className="text-[#546FFF] text-sm cursor-pointer">
                          {replies[comment._id].length} Replies
                        </span>
                      )}
                    </div>
                    {replies[comment._id] &&
                      replies[comment._id].length > 0 && (
                        <div className="ml-6 mt-2 space-y-2">
                          {replies[comment._id].map((reply, index) => (
                            <div key={index} className="flex gap-3 items-start">
                              <Avatar
                                className="!w-8 !h-8"
                                src={
                                  reply.user?.image?.length
                                    ? hostGoogleImage(reply.user.image[0].url)
                                    : undefined
                                }
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-800 text-sm">
                                    @
                                    {reply.user?.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "")}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {DateTime.fromISO(
                                      reply.createdAt
                                    ).toRelative()}
                                  </span>
                                </div>
                                <p className="text-gray-800 text-sm mt-1">
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
