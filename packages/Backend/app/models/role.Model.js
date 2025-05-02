const mongoose = require("mongoose");

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
        values: ["Read", "Add", "Delete", "Edit", "Admin"],
        message: "{VALUE} is not a valid permission.",
      },
    },
  ],
  color: {
    type: String,
    default: "#FFFFFF",
  },
});
roleSchema.pre("save", function (next) {
  if (this.permissions.includes("Admin")) {
    const allPermissions = ["Read", "Add", "Delete", "Edit", "Admin"];
    this.permissions = [...new Set([...this.permissions, ...allPermissions])];
  }
  next();
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
    // delete ret.theCreator;
    return ret;
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
