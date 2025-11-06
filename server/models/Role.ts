import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["admin", "moderator", "seller", "customer"],
  },
  permissions: [
    {
      resource: {
        type: String,
        required: true,
        enum: ["product", "category", "order", "user"],
      },
      actions: {
        type: [String],
        required: true,
        enum: ["create", "read", "update", "delete"],
      },
    },
  ],
});

export default model("Role", roleSchema);
