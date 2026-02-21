import { API } from "@/api/api";

const BASE_URL = "http://localhost:9999/depiV1";

// Get all comments for a specific user and project
export const getComments = async (userId, projectId) => {
  try {
    console.log("Fetching comments for user:", userId, "project:", projectId);

    const res = await API.get(`${userId}/projects/${projectId}/comments`, {
      withCredentials: true,
    });
    console.log("Comments fetched successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Get one comment
export const getCommentById = async (userId, projectId, commentId) => {
  try {
    console.log(
      "Fetching comment:",
      commentId,
      "for user:",
      userId,
      "project:",
      projectId,
    );

    const res = await API.get(
      `${userId}/projects/${projectId}/comments/${commentId}`,
      {
        withCredentials: true,
      },
    );
    console.log("Comment fetched successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (userId, projectId, commentData) => {
  try {
    console.log(
      "Creating comment for user:",
      userId,
      "project:",
      projectId,
      "data:",
      commentData,
    );

    const res = await API.post(
      `${userId}/projects/${projectId}/comments`,
      commentData,
      {
        withCredentials: true,
      },
    );
    console.log("Comment created successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Error creating comment:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Update a comment
export const updateComment = async (
  userId,
  projectId,
  commentId,
  commentData,
) => {
  try {
    console.log("Updating comment:", commentId, "with data:", commentData);

    const res = await API.patch(
      `${userId}/projects/${projectId}/comments/${commentId}`,
      commentData,
      { withCredentials: true },
    );
    console.log("Comment updated successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating comment:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (userId, projectId, commentId) => {
  try {
    console.log(
      "Deleting comment:",
      commentId,
      "for user:",
      userId,
      "project:",
      projectId,
    );

    const res = await API.delete(
      `${userId}/projects/${projectId}/comments/${commentId}`,
      {
        withCredentials: true,
      },
    );
    console.log("Comment deleted successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Remove comment image
export const removeCommentImage = async (
  userId,
  projectId,
  commentId,
  publicId,
) => {
  try {
    console.log(
      "Removing comment image for comment:",
      commentId,
      "publicId:",
      publicId,
    );

    const res = await API.patch(
      `${userId}/projects/${projectId}/comments/${commentId}/image`,
      { public_id: publicId },
      { withCredentials: true },
    );
    console.log("Comment image removed successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error removing comment image:", error);
    throw error;
  }
};
