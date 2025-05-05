const {
  handlePrivateMessage,
} = require("../controllers/message.Controller.js");
const { userSocketMap, addSocket, removeSocket } = require("./userSocketMap");
const mongoose = require("mongoose");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    // Handle user connection
    socket.on("user:connected", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        socket.emit("error", "Invalid user ID format");
        return;
      }
      addSocket(userId, socket.id);
      io.emit("user:online", userId);
    });

    // Handle private messages
    socket.on("private:message", (data) => {
      handlePrivateMessage(io, userSocketMap, data);
    });

    // Typing indicator
    socket.on("typing", ({ from, to }) => {
      const receiverSockets = userSocketMap[to];
      if (receiverSockets) {
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit("user:typing", { from });
        });
      }
    });

    // Message seen confirmation
    socket.on("message:seen", ({ messageId, from, to }) => {
      const senderSockets = userSocketMap[from];
      if (senderSockets) {
        senderSockets.forEach((socketId) => {
          io.to(socketId).emit("message:seen", { messageId, seenBy: to });
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const userId = Object.keys(userSocketMap).find((id) =>
        userSocketMap[id].has(socket.id)
      );

      if (userId) {
        removeSocket(userId, socket.id);
        if (!userSocketMap[userId]?.size) {
          io.emit("user:offline", userId);
        }
      }
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
