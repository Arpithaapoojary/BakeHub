import Menu from "../models/menu.model.js";
import Bakery from "../models/bakery.model.js";

// 🧁 Create a new menu item (only bakery owner)
export const createMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const bakery = await Bakery.findOne({ ownerId });

    if (!bakery)
      return res
        .status(404)
        .json({ message: "No bakery found for this owner." });
    if (bakery.status !== "approved")
      return res.status(403).json({ message: "Bakery not approved yet." });

    const menuItem = await Menu.create({
      bakeryId: bakery._id,
      ...req.body,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get all menu items for the owner's bakery
export const getOwnerMenu = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const bakery = await Bakery.findOne({ ownerId });

    if (!bakery)
      return res
        .status(404)
        .json({ message: "No bakery found for this owner." });

    const menu = await Menu.find({ bakeryId: bakery._id });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
