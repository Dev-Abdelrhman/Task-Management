const SF = require("../controllers/socket.Controller.js");
const Chat = require("../models/chat.Model.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on(
      "chat:getAll",
      SF.getAllSocket(Chat, "members", [
        { path: "members", select: "name username image" },
        { path: "groupAdmin", select: "name username image" },
        {
          path: "lastMessage",
          populate: { path: "sender", select: "name" },
        },
      ])
    );

    socket.on("chat:create", (data, callback) =>
      SF.createOneSocket(
        Chat,
        "Chats_Icons",
        "image",
        "createdBy"
      )({ data }, callback, io)
    );

    socket.on("chat:update", (data, callback) =>
      SF.updateOneSocket(Chat)({ id: data.id, updates: data }, callback, io)
    );

    socket.on("chat:delete", (data, callback) =>
      SF.deleteOneSocket(Chat)({ id: data.id }, callback, io)
    );
  });
};
