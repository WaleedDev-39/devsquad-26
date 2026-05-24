const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Variant = require("../models/Variant");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price images stock")
      .populate("items.variant", "label weight priceDifference stock");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.variant || item.variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name} - ${item.variant?.label || "unknown"}`,
        });
      }
    }

    // Build order items and calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      const price = item.product.price + (item.variant.priceDifference || 0);
      subtotal += price * item.quantity;
      return {
        product: item.product._id,
        variant: item.variant._id,
        name: item.product.name,
        variantLabel: `${item.variant.label} - ${item.variant.weight}`,
        price,
        quantity: item.quantity,
        image: item.product.images?.[0] || "",
      };
    });

    const deliveryFee = 3.95;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      total: Math.round(total * 100) / 100,
      shippingAddress,
    });

    // Reduce stock
    for (const item of cart.items) {
      await Variant.findByIdAndUpdate(item.variant._id, {
        $inc: { stock: -item.quantity },
      });
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Users can only see their own orders
    if (req.user.role === "user" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
