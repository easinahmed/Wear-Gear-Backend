const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendMail = require('../utils/sendMail');

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before placing an order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.product}` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0] || '',
        });
        totalAmount += product.price * item.quantity;
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      } else {
        orderItems.push({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
        });
        totalAmount += item.price * item.quantity;
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });

    const user = await User.findById(req.user._id);
    if (user) {
      const itemsList = orderItems.map(i => `${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`).join('\n');
      sendMail(
        user.email,
        `Order Confirmed — #${order._id.toString().slice(-8)}`,
        `Hi ${user.name},\n\nYour order has been placed successfully!\n\nOrder #${order._id.toString().slice(-8)}\n\n${itemsList}\n\nTotal: $${totalAmount.toFixed(2)}\nShipping to: ${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}\n\nThank you for shopping with Wear & Gear!`
      ).catch(err => console.error(`[MAIL FAILED] to ${user.email} — order confirmation:`, err.message));
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(),
    ]);

    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrder, getAllOrders, updateOrderStatus };
