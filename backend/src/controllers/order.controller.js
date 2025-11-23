import Order from "../models/order.model.js";
import Bakery from "../models/bakery.model.js";
import User from "../models/user.model.js";
import { sendMail } from "../utils/mailer.js";

// -----------------------------
// CUSTOMER: PLACE ORDER
// -----------------------------
export const placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    // bakeryId from item list
    const bakeryId = items[0].bakeryId;

    // Create order
    const order = await Order.create({
      customerId: req.user.id,
      bakeryId,
      items,
      total,
      status: "pending",
    });

    // ----------------------------------------------------
    // 📧 EMAIL NOTIFICATIONS
    // ----------------------------------------------------

    // Fetch customer details
    const customer = await User.findById(req.user.id);

    // Generate HTML list of items
    const itemHtml = items
      .map((i) => `<li>${i.qty} × ${i.name} — ₹${i.price * i.qty}</li>`)
      .join("");

    // 1️⃣ Customer email: Order confirmation
    await sendMail({
      to: customer.email,
      subject: "Your BakeHub Order is Confirmed! 🎉",
      html: `
        <h2>Hello ${customer.name},</h2>
        <p>Your order has been placed successfully!</p>

        <h3>Order Summary:</h3>
        <ul>${itemHtml}</ul>

        <p><b>Total:</b> ₹${total}</p>
        <p>Estimated Delivery: 30–45 minutes</p>

        <br>
        <p>Thank you for ordering from BakeHub 🧁</p>
      `,
    });

    // Fetch bakery owner email
    const bakery = await Bakery.findById(bakeryId).populate("ownerId");

    if (bakery?.ownerId?.email) {
      // 2️⃣ Owner email: New order received
      await sendMail({
        to: bakery.ownerId.email,
        subject: "🍰 New Order Received on BakeHub",
        html: `
          <h2>Hello ${bakery.ownerId.name},</h2>
          <p>You have received a new order for <b>${bakery.name}</b>.</p>

          <h3>Order Items:</h3>
          <ul>${itemHtml}</ul>

          <p><b>Total:</b> ₹${total}</p>
          <p>Check your Owner Dashboard to manage this order.</p>
        `,
      });
    }

    // Respond
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
