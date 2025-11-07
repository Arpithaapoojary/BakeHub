import Bakery from "../models/bakery.model.js";

// 🧁 Create Bakery (Admin Only)
export const createBakery = async (req, res) => {
  try {
    const { name, address, description, ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ message: "ownerId is required" });
    }

    const bakery = await Bakery.create({
      name,
      address,
      description,
      ownerId,
      status: "pending",
    });

    res.status(201).json({
      message: "Bakery created successfully",
      bakery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧁 Get All Approved Bakeries
export const getAllBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.find({ status: "approved" }).populate(
      "ownerId",
      "name email"
    );
    res.json(bakeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get Bakery by ID
export const getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );
    if (!bakery) return res.status(404).json({ message: "Bakery not found" });
    res.json(bakery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 Approve Bakery (Admin Only)
export const approveBakery = async (req, res) => {
  try {
    const { id } = req.params;
    const bakery = await Bakery.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!bakery) {
      return res.status(404).json({ message: "Bakery not found" });
    }

    res.json({
      message: "Bakery approved successfully",
      bakery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
