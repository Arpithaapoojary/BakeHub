import Product from "../models/product.model.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      bakeryId,
      name,
      description,
      price,
      isSoldOut,
      category,
      imageUrl,
    } = req.body;

    const finalImageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : imageUrl || "";

    const product = await Product.create({
      bakeryId,
      name,
      description,
      price: Number(price),
      imageUrl: finalImageUrl,
      isSoldOut: isSoldOut === "true" || isSoldOut === true,
      category,
    });

    res.json(product);
  } catch (err) {
    console.error("Create product error:", err);
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
    console.error("Get products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, isSoldOut, category, imageUrl } =
      req.body;

    const updates = {
      name,
      description,
      price: Number(price),
      isSoldOut: isSoldOut === "true" || isSoldOut === true,
      category,
    };

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
