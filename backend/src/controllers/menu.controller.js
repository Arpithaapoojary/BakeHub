import Menu from "../models/menu.model.js";

// ✅ Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const menus = await Menu.find({ ownerId: req.user.sub });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const item = await Menu.create({ ...req.body, ownerId: req.user.sub });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const updated = await Menu.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.sub },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await Menu.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.sub,
    });
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
