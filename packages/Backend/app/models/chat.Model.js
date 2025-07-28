const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    image: [
      {
        public_id: String,
        url: String,
        original_filename: String,
        format: String,
      },
    ],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (value) {
          if (this.isGroup && !value) return false;
          return true;
        },
        message: "Group chat must have a group admin.",
      },
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
