import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
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

const Role = mongoose.model("Role", roleSchema);

export default Role;
