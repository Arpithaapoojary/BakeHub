import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    bakery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bakery",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
