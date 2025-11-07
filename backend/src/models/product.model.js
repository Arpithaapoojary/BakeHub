import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    bakeryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bakery",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    isSoldOut: { type: Boolean, default: false },
    image: { type: String }, // optional: URL for image
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
