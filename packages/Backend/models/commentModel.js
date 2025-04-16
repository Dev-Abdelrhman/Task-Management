const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

commentSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.project;
    return ret;
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
