import Bakery from "../models/bakery.model.js";

// ✅ Fetch the bakery owned by the logged-in owner
export const getOwnerBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ ownerId: req.user._id });
    if (!bakery) {
      return res
        .status(404)
        .json({ message: "No bakery found for this account" });
    }
    res.json(bakery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
