const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Variant = require("../models/Variant");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price images")
      .populate("items.variant", "label weight priceDifference stock");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const variant = await Variant.findById(variantId);
    if (!variant) return res.status(404).json({ success: false, message: "Variant not found" });
    if (variant.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId && i.variant.toString() === variantId
    );

    if (existingItem) {
      if (variant.stock < existingItem.quantity + quantity) {
        return res.status(400).json({ success: false, message: "Insufficient stock" });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, variant: variantId, quantity });
    }

    await cart.save();
    cart = await Cart.findById(cart._id)
      .populate("items.product", "name price images")
      .populate("items.variant", "label weight priceDifference stock");

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const variant = await Variant.findById(item.variant);
    if (variant.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    item.quantity = quantity;
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate("items.product", "name price images")
      .populate("items.variant", "label weight priceDifference stock");

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate("items.product", "name price images")
      .populate("items.variant", "label weight priceDifference stock");

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
