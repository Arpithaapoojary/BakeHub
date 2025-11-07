import mongoose from "mongoose";

const bakerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bakery", bakerySchema);
