import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "In Progress", "Completed"],
      default: "todo",
    },
    completedAt: {
      type: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
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
  if (this.isModified("name")) return next();
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

projectSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "Roles", select: "name -_id" },
    { path: "project", select: "name -_id" },
  ]);

  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
