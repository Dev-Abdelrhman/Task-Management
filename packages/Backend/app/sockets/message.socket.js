const SF = require("../controllers/socket.Controller.js");
const Message = require("../models/message.Model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on(
      "message:getAll",
      SF.getAllSocket(Message, "chat", [
        { path: "sender", select: "name username image" },
        { path: "seenBy", select: "name username image" },
        {
          path: "replyTo",
          populate: { path: "sender", select: "name username" },
        },
      ])
    );

    socket.on("message:create", (data, callback) =>
      SF.createOneSocket(
        Message,
        "Messages_Images",
        "image",
        "sender"
      )({ data }, callback, io)
    );

    socket.on("message:update", (data, callback) =>
      SF.updateOneSocket(Message)({ id: data.id, updates: data }, callback, io)
    );

    socket.on("message:delete", (data, callback) =>
      SF.deleteOneSocket(Message)({ id: data.id }, callback, io)
    );
  });
};
