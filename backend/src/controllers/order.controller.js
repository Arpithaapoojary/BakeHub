import Order from "../models/order.model.js";
import Bakery from "../models/bakery.model.js";
import User from "../models/user.model.js";

// -----------------------------
// CUSTOMER: PLACE ORDER
// -----------------------------
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      total,
      address,
      phone,
      note,
      paymentMethod,
      paymentStatus,
      paidAmount,
    } = req.body;

    // VALIDATION
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // bakeryId from first item
    const bakeryId = items[0].bakeryId;

    // CREATE ORDER
    const order = await Order.create({
      customerId: req.user.id,
      bakeryId,
      items,
      total,
      address,
      phone,
      note,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentStatus || "pending",
      paidAmount: paidAmount || 0,
      status: "pending",
    });

    return res.status(201).json(order);
  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// CUSTOMER: VIEW MY ORDERS
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
// OWNER: VIEW ORDERS
// -----------------------------
export const getOwnerOrders = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ ownerId: req.user.id });

    if (!bakery) {
      return res.status(404).json({ message: "Bakery not found" });
    }

    const orders = await Order.find({ bakeryId: bakery._id })
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

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

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// OWNER: UPDATE PAYMENT STATUS
// -----------------------------
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paidAmount } = req.body;

    // If owner marks COD as PAID, paidAmount should become total.
    let updateFields = {
      paymentStatus,
    };

    if (paymentStatus === "paid") {
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // If COD → set paidAmount = full order total
      updateFields.paidAmount = paidAmount || order.total;
    } else {
      // If switching back to pending
      updateFields.paidAmount = 0;
    }

    const updated = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.log("Payment Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// GET ORDER BY ID (Customer Invoice)
// -----------------------------
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
