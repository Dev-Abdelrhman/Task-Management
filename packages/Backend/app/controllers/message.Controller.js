const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Message = require("../models/message.Model.js");
const User = require("../models/user.Model.js");
const FC = require("./Factory.Controller.js");
const uploader = FC.uploader("images", 5);
const mongoose = require("mongoose");

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });

    fs.unlinkSync(file.path);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      original_filename: result.original_filename,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    fs.unlinkSync(file.path);
    throw new Error("Failed to upload image");
  }
};

const handlePrivateMessage = async (io, userSocketMap, data) => {
  const { from, to, text, replyTo = null } = data;
  const images = data.images || [];

  if (
    !mongoose.Types.ObjectId.isValid(from) ||
    !mongoose.Types.ObjectId.isValid(to)
  ) {
    io.to(userSocketMap[from]).emit("error", "Invalid user ID");
    return;
  }

  try {
    if (images.length > 5) {
      throw new Error("Maximum 5 images allowed");
    }

    const [sender, receiver] = await Promise.all([
      User.findById(from),
      User.findById(to),
    ]);

    if (!sender || !receiver) {
      throw new Error("Sender or receiver not found");
    }

    let imageData = [];
    if (images.length > 0) {
      imageData = await Promise.all(images.map(uploadImage));
    }

    const message = await Message.create({
      from,
      to,
      text: text || null,
      image: imageData.length ? imageData : null,
      replyTo,
    });

    const populatedMessage = await Message.populate(message, {
      path: "from to replyTo",
      populate: { path: "replyTo", populate: { path: "from to" } },
    });

    [userSocketMap[to], userSocketMap[from]].forEach((socketId) => {
      if (socketId) io.to(socketId).emit("messageReceived", populatedMessage);
    });
  } catch (err) {
    console.error("Private message error:", err);
    const senderSocket = userSocketMap[from];
    if (senderSocket) io.to(senderSocket).emit("error", err.message);
  }
};

module.exports = { handlePrivateMessage };
