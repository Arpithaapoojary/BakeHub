import Product from "../models/product.model.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      bakeryId,
      name,
      description,
      price,
      imageUrl,
      isSoldOut,
      category,
    } = req.body;

    const product = await Product.create({
      bakeryId,
      name,
      description,
      price,
      imageUrl,
      isSoldOut,
      category, // ⭐ ADDED
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// GET PRODUCTS BY BAKERY
export const getProductsByBakery = async (req, res) => {
  try {
    const { bakeryId } = req.params;
    const products = await Product.find({ bakeryId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      isSoldOut: req.body.isSoldOut,
      category: req.body.category || "Uncategorized", // ⭐ ADDED
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
