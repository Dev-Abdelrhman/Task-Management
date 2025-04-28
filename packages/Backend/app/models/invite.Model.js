const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

inviteSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "sender", select: "name -_id" },
    { path: "project", select: "name _id" },
    { path: "receiver", select: "name -_id" },
    { path: "role", select: "name _id" },
  ]);
  next();
});

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;
