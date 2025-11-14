import Bakery from "../models/bakery.model.js";

// Get approved bakeries for customers
export const getApprovedBakeries = async (_req, res) => {
  try {
    const bakeries = await Bakery.find({ status: "approved" });
    res.json(bakeries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a bakery by ID
export const getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.id);
    if (!bakery) return res.status(404).json({ message: "Bakery not found" });

    res.json(bakery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner registers bakery
export const registerBakery = async (req, res) => {
  try {
    const { name, address } = req.body;
    const bakery = await Bakery.create({
      name,
      address,
      ownerId: req.user.id,
      status: "pending"
    });
    res.status(201).json(bakery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin approves bakery
export const approveBakery = async (req, res) => {
  try {
    const updated = await Bakery.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Bakery not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
