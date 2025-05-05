const userSocketMap = require("./userSocketMap");

const notificationSocket = (io) => {
  io.on("connection", (socket) => {
    // Send notification to a specific user
    socket.on("notify:user", ({ toUserId, notification }) => {
      const targetSocket = userSocketMap[toUserId];
      if (targetSocket) {
        io.to(targetSocket).emit("notification", notification);
      }
    });
  });
};

module.exports = notificationSocket;
