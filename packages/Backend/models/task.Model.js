const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: [
      {
        public_id: String,
        url: String,
        original_filename: String,
        format: String,
      },
    ],
    description: {
      type: String,
      // required: true,
    },
    dueDate: {
      type: Date,
      // required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Todo", "In Progress", "Completed"],
      default: "Pending",
    },
    completedAt: {
      type: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

taskSchema.pre("save", function (next) {
  if (this.isModified("title")) return next();
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "project",
    select: "name -_id",
    options: { strictPopulate: false },
  }).populate({
    path: "owner" || "assignedTo",
    select: "name -_id",
  });

  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
