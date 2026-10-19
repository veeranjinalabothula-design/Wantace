const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { validateOrderInput } = require('../lib/validateOrder');

const router = express.Router();

router.post('/', async (req, res) => {
  const validation = validateOrderInput(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const order = await Order.create(validation.value);
    return res.status(201).json(order);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Unable to create order:', error);
    return res.status(500).json({ error: 'Unable to create order.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (error) {
    console.error('Unable to fetch orders:', error);
    return res.status(500).json({ error: 'Unable to fetch orders.' });
  }
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Order id is invalid.' });
  }

  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    return res.json(order);
  } catch (error) {
    console.error('Unable to fetch order:', error);
    return res.status(500).json({ error: 'Unable to fetch order.' });
  }
});

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Order id is invalid.' });
  }

  const validation = validateOrderInput(req.body, { partial: true });
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: validation.value },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    return res.json(order);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Unable to update order:', error);
    return res.status(500).json({ error: 'Unable to update order.' });
  }
});

module.exports = router;
