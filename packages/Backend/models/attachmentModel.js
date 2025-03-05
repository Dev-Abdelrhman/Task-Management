import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    name: String,
    file: Buffer,
    contentType: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const attachment = mongoose.model("Attachment", attachmentSchema);

export default attachment;
