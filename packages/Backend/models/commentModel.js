import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Review can't be empty"],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name -_id" }).populate({
    path: "project",
    select: "name",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
