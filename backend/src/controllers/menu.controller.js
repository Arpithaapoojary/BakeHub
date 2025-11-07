import Menu from "../models/menu.model.js";

// ➕ Add menu item (Owner only)
export const addMenuItem = async (req, res) => {
  try {
    const { name, price, description, bakeryId } = req.body;

    if (!name || !price || !bakeryId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newItem = await Menu.create({
      name,
      price,
      description,
      bakery: bakeryId,
    });

    res.status(201).json({ message: "Menu item added successfully", newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 View all items for a bakery
export const getMenuItems = async (req, res) => {
  try {
    const { bakeryId } = req.params;
    const items = await Menu.find({ bakery: bakeryId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete a menu item (Owner only)
export const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
