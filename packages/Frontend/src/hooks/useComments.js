import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment, updateComment, deleteComment } from "../api/commentsApi";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:9999");

export const useComments = (userId, projectId, user) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [replies, setReplies] = useState(() => {
    const savedReplies = localStorage.getItem(`replies_${projectId}`);
    if (!savedReplies) return {};
    try {
      return JSON.parse(savedReplies);
    } catch (error) {
      console.error("Error parsing replies from localStorage:", error);
      return {};
    }
  });
  const [replyText, setReplyText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  const queryClient = useQueryClient();

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", projectId],
    queryFn: async () => {
      if (!userId || !projectId) return null;
      return await getComments(userId, projectId);
    },
    enabled: !!userId && !!projectId && showComments,
  });

  const handleError = (error) => {
    return error?.response?.data?.message || "Something went wrong";
  };

  // Create Comment Mutation with Optimistic Update
  const createCommentMutation = useMutation({
    mutationFn: (commentData) => createComment(userId, projectId, commentData),
    onMutate: async (newCommentData) => {
      await queryClient.cancelQueries(["comments", projectId]);
      const previousComments = queryClient.getQueryData(["comments", projectId]);

      const optimisticComment = {
        _id: "temp-" + Date.now(),
        ...newCommentData,
        user: {
          name: user.name,
          image: user.image || [],
        },
        createdAt: new Date().toISOString(),
        replies: [],
      };

      queryClient.setQueryData(["comments", projectId], (old) => ({
        ...old,
        doc: [...(old?.doc || []), optimisticComment],
      }));

      return { previousComments };
    },
    onError: (err, newCommentData, context) => {
      queryClient.setQueryData(["comments", projectId], context.previousComments);
      toast.error(handleError(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", projectId]);
    },
    onSuccess: () => {
      setCommentText("");
    },
  });

  // Update Comment Mutation with Optimistic Update
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, commentData }) =>
      updateComment(userId, projectId, commentId, commentData),
    onMutate: async ({ commentId, commentData }) => {
      await queryClient.cancelQueries(["comments", projectId]);
      const previousComments = queryClient.getQueryData(["comments", projectId]);

      queryClient.setQueryData(["comments", projectId], (old) => ({
        ...old,
        doc: old.doc.map((comment) =>
          comment._id === commentId
            ? { ...comment, comment: commentData.comment }
            : comment
        ),
      }));

      return { previousComments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", projectId], context.previousComments);
      toast.error(handleError(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", projectId]);
    },
    onSuccess: () => {
      setCommentText("");
      setEditingCommentId(null);
    },
  });

  // Delete Comment Mutation with Optimistic Update
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(userId, projectId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["comments", projectId]);
      const previousComments = queryClient.getQueryData(["comments", projectId]);

      queryClient.setQueryData(["comments", projectId], (old) => ({
        ...old,
        doc: old.doc.filter((comment) => comment._id !== commentId),
      }));

      return { previousComments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["comments", projectId], context.previousComments);
      toast.error(handleError(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", projectId]);
    },
  });

  useEffect(() => {
    localStorage.setItem(`replies_${projectId}`, JSON.stringify(replies));
  }, [replies, projectId]);

  useEffect(() => {
    if (!userId || !projectId) return;

    socket.on("comment-created", () => {
      queryClient.invalidateQueries(["comments", projectId]);
    });

    socket.on("comment-updated", () => {
      queryClient.invalidateQueries(["comments", projectId]);
    });

    socket.on("comment-deleted", () => {
      queryClient.invalidateQueries(["comments", projectId]);
    });

    return () => {
      socket.off("comment-created");
      socket.off("comment-updated");
      socket.off("comment-deleted");
    };
  }, [userId, projectId, queryClient]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() && !replyText.trim()) return;
    if (editingCommentId) {
      updateCommentMutation.mutate({
        commentId: editingCommentId,
        commentData: { comment: commentText },
      });
    } else if (replyingToCommentId) {
      handleReplySubmit(replyingToCommentId);
    } else {
      createCommentMutation.mutate({ comment: commentText });
    }
  };

  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    const newReply = {
      user: { name: user.name, image: user.image || [] },
      comment: replyText,
      createdAt: new Date().toISOString(),
    };
    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: [...(prevReplies[commentId] || []), newReply],
    }));
    setReplyText("");
    setReplyingToCommentId(null);
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(selectedCommentId);
    setCommentText(comment.comment);
    handleMenuClose();
  };

  const handleDeleteComment = () => {
    deleteCommentMutation.mutate(selectedCommentId);
    handleMenuClose();
  };

  return {
    commentText,
    setCommentText,
    showComments,
    setShowComments,
    editingCommentId,
    setEditingCommentId,
    anchorEl,
    setAnchorEl,
    selectedCommentId,
    setSelectedCommentId,
    replies,
    setReplies,
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
  };
}; 