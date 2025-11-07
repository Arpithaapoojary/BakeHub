import Product from "../models/product.model.js";

// 🧁 Create Product (Owner Only)
export const createProduct = async (req, res) => {
  try {
    const { bakeryId, name, description, price, image } = req.body;
    const product = await Product.create({
      bakeryId,
      name,
      description,
      price,
      image,
    });
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🍰 Get Products by Bakery
export const getProductsByBakery = async (req, res) => {
  try {
    const { bakeryId } = req.params;
    const products = await Product.find({ bakeryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "Product updated", product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
