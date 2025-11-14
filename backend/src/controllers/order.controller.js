import Order from "../models/order.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      customerId: req.user.id,
      items,
      total,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
