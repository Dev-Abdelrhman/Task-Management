import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  actions: [{ type: String, required: true }],
});
const Permissions = mongoose.model("Permissions", permissionsSchema);

export default Permissions;