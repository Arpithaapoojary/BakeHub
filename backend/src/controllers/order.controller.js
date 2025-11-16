import Order from "../models/order.model.js";
import Bakery from "../models/bakery.model.js";

// -----------------------------
// CUSTOMER: PLACE ORDER
// -----------------------------
export const placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    // bakeryId must come from menu items
    const bakeryId = items[0].bakeryId;

    const order = await Order.create({
      customerId: req.user.id,
      bakeryId,
      items,
      total,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.log("Place Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// CUSTOMER: VIEW OWN ORDERS
// -----------------------------
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// OWNER: VIEW ORDERS FOR THEIR BAKERY
// -----------------------------
export const getOwnerOrders = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ ownerId: req.user.id });

    if (!bakery) {
      return res.status(404).json({ message: "Bakery not found for owner" });
    }

    const orders = await Order.find({ bakeryId: bakery._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.log("Owner Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// OWNER: UPDATE ORDER STATUS
// -----------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (err) {
    console.log("Update Status Error:", err);
    res.status(500).json({ message: err.message });
  }
};
