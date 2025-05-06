const userSocketMap = {};

const addSocket = (userId, socketId) => {
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set();
  }
  userSocketMap[userId].add(socketId);
};

const removeSocket = (userId, socketId) => {
  if (userSocketMap[userId]) {
    userSocketMap[userId].delete(socketId);
    if (userSocketMap[userId].size === 0) {
      delete userSocketMap[userId];
    }
  }
};

module.exports = { userSocketMap, addSocket, removeSocket };
