import Bakery from "../models/bakery.model.js";

// 🧁 Create a new bakery (by owner)
export const createBakery = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    const bakery = await Bakery.create({
      name,
      address,
      description,
      ownerId: req.user.id,
      status: "pending",
    });
    res.status(201).json({ message: "Bakery created successfully", bakery });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🌍 Get all approved bakeries (for customers)
export const getAllBakeries = async (_req, res) => {
  try {
    const bakeries = await Bakery.find({ status: "approved" });
    res.json(bakeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 Approve bakery (by admin)
export const approveBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!bakery) return res.status(404).json({ message: "Bakery not found" });
    res.json({ message: "Bakery approved successfully", bakery });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
