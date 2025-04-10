import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  theCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: { type: String, required: true },
  permissions: [
    {
      type: String,
      enum: {
        values: ["read", "write", "delete"],
        message: "{VALUE} is not a valid permission.",
      },
    },
  ],
});

roleSchema.pre(/^find/, function (next) {
  this.populate({ path: "theCreator", select: "name _id" }).populate({
    path: "project",
    select: "name _id",
  });
  next();
});

roleSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.project;
    delete ret.theCreator;
    return ret;
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
