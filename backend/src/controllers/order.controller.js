import Order from "../models/order.model.js";
import Bakery from "../models/bakery.model.js";

// -----------------------------
// CUSTOMER: PLACE ORDER
// -----------------------------
export const placeOrder = async (req, res) => {
  try {
    const { items, total, address, phone, note, paymentMethod, paidAmount } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const bakeryId = items[0].bakeryId;

    const order = await Order.create({
      customerId: req.user.id,
      bakeryId,
      items,
      total,
      address,
      phone,
      note,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      paidAmount: paymentMethod === "cod" ? 0 : paidAmount,
      status: "pending",
    });

    return res.status(201).json(order);
  } catch (err) {
    console.log("Place Order Error:", err);
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
// GET ORDER BY ID (TRACK ORDER + INVOICE)
// -----------------------------
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const userId = req.user.id;
    const role = req.user.role;

    // -----------------------------
    // CUSTOMER ACCESS LOGIC
    // -----------------------------
    if (role === "customer") {
      if (order.customerId.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    // -----------------------------
    // OWNER ACCESS LOGIC
    // -----------------------------
    if (role === "owner") {
      const bakery = await Bakery.findOne({ ownerId: userId });

      if (!bakery) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // owner can only view orders belonging to his own bakery
      if (bakery._id.toString() !== order.bakeryId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    // -----------------------------
    // ADMIN ACCESS ALWAYS ALLOWED
    // -----------------------------
    // no special check needed

    // normalize status
    order.status = order.status?.toLowerCase();

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// OWNER: VIEW ALL ORDERS FOR HIS BAKERY
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

    return res.json(orders);
  } catch (err) {
    console.log("Owner Orders Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// OWNER: UPDATE ORDER STATUS
// -----------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "ready", "completed"];

    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed: pending, confirmed, ready, completed",
      });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// OWNER: UPDATE PAYMENT STATUS
// -----------------------------
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paidAmount } = req.body;

    const validStatuses = ["paid", "pending"];

    if (!validStatuses.includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid payment status. Allowed: paid, pending",
      });
    }

    let updateFields = {
      paymentStatus: paymentStatus.toLowerCase(),
    };

    if (paymentStatus.toLowerCase() === "paid") {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      updateFields.paidAmount = paidAmount || order.total;
    } else {
      updateFields.paidAmount = 0;
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    return res.json(updated);
  } catch (err) {
    console.log("Payment Update Error:", err);
    return res.status(500).json({ message: err.message });
  }
};
