import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      // required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      // required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

projectSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

projectSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "owner", select: "name -_id" },
    { path: "members.user", select: "name -_id" },
    { path: "members.role", select: "name -_id" },
  ]);
  next();
});

projectSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

projectSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "project",
  localField: "_id",
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
