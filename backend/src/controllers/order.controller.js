import Order from "../models/order.model.js";

// 🧁 Create New Order (Customer)
export const createOrder = async (req, res) => {
  try {
    const { bakeryId, items, total, pickupTime } = req.body;
    const customerId = req.user._id;

    const order = await Order.create({
      customerId,
      bakeryId,
      items,
      total,
      pickupTime,
      status: "Confirmed",
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 Get Orders by Customer
export const getOrdersByCustomer = async (req, res) => {
  try {
    const customerId = req.user._id;
    const orders = await Order.find({ customerId })
      .populate("bakeryId", "name address")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧑‍🍳 Get Orders by Bakery (Owner)
export const getOrdersByBakery = async (req, res) => {
  try {
    const bakeryId = req.params.bakeryId;
    const orders = await Order.find({ bakeryId })
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Update Order Status (Owner)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ message: "Order status updated", order: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
