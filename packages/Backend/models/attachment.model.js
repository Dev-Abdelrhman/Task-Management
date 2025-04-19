const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    file: {
      public_id: String,
      url: String,
      original_filename: String,
      format: String,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

attachmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "task",
    select: "title -_id",
    options: { strictPopulate: false },
  }).populate({
    path: "user",
    select: "name -_id",
  });
  next();
});

// attachmentSchema.set("toJSON", {
//   transform: function (doc, ret) {
//     delete ret.task;
//     return ret;
//   },
// });

const Attachment = mongoose.model("Attachment", attachmentSchema);

module.exports = Attachment;
