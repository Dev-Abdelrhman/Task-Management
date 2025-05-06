const GroupMessage = require("../models/groupMessage.Model.js");
const Group = require("../models/group.Model.js");
const { userSocketMap } = require("./userSocketMap");
const { uploadImage } = require("../controllers/message.Controller.js");
const mongoose = require("mongoose");

const groupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("📡 Group socket connected:", socket.id);

    socket.on("group:join", async ({ groupId, userId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
          throw new Error("Invalid group ID");
        }

        const group = await Group.findById(groupId);
        if (group?.members.includes(userId)) {
          socket.join(groupId);
          io.to(groupId).emit("group:user:joined", { groupId, userId });
        }
      } catch (err) {
        socket.emit("group:error", { message: err.message });
      }
    });

    socket.on("group:leave", ({ groupId, userId }) => {
      socket.leave(groupId);
      io.to(groupId).emit("group:user:left", { groupId, userId });
    });

    socket.on(
      "group:message",
      async ({ groupId, from, text, images = [], replyTo = null }) => {
        try {
          if (
            !mongoose.Types.ObjectId.isValid(from) ||
            !mongoose.Types.ObjectId.isValid(groupId)
          ) {
            throw new Error("Invalid user or group ID");
          }

          let imageData = [];
          if (images.length > 0) {
            if (images.length > 5) throw new Error("Maximum 5 images allowed");
            imageData = await Promise.all(images.map(uploadImage));
          }

          const group = await Group.findById(groupId)
            .populate("members", "_id")
            .lean();

          if (!group) throw new Error("Group not found");
          if (!group.members.some((m) => m._id.equals(from))) {
            throw new Error("User not in group");
          }

          const newMessage = await GroupMessage.create({
            group: groupId,
            from,
            text: text || null,
            image: imageData,
            replyTo,
          });

          const populatedMessage = await GroupMessage.populate(newMessage, [
            { path: "from", select: "name avatar" },
            {
              path: "replyTo",
              populate: { path: "from", select: "name avatar" },
            },
          ]);

          io.to(groupId).emit("group:message", populatedMessage);
        } catch (err) {
          console.error("Group message error:", err);
          socket.emit("group:error", { message: err.message });
        }
      }
    );

    socket.on("group:typing", ({ groupId, from }) => {
      socket.to(groupId).emit("group:typing", { groupId, from });
    });

    socket.on("disconnect", () => {
      console.log("📴 Group socket disconnected:", socket.id);
    });
  });
};

module.exports = groupSocket;
