import mongoose from "mongoose";

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

inviteSchema.virtual("senderName").get(function () {
  return this.sender.name;
});

inviteSchema.virtual("receiverName").get(function () {
  return this.receiver.name;
});

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;

// For testing purposes
// const invite = new Invite({
//     user: "user_id",
//     project: "project_id",
//     role: "role_id"
//     // status: "pending" // Optional, default is "pending"
//     // timestamp: new Date() // Optional, default is current date and time
// })
