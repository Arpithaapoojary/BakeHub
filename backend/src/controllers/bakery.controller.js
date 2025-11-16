import Bakery from "../models/bakery.model.js";

// ⭐ OWNER: Get bakery of logged-in owner
export const getMyBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ ownerId: req.user.id });

    if (!bakery)
      return res
        .status(404)
        .json({ message: "No bakery found for this owner." });

    res.json(bakery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ PUBLIC: Get ONLY approved bakeries (for customers)
export const getApprovedBakeries = async (req, res) => {
  try {
    const bakeries = await Bakery.find({ status: "approved" });

    res.json(bakeries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ PUBLIC: Get bakery by ID
export const getBakeryById = async (req, res) => {
  try {
    const bakery = await Bakery.findById(req.params.id);

    if (!bakery) return res.status(404).json({ message: "Bakery not found" });

    res.json(bakery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
