const express = require('express');
const Order = require('../../models/Order'); // Adjusted path according to new file location
const Dealer = require('../../models/Dealer'); // Adjusted path according to new file location
const VehicleType = require('../../models/VehicleType'); // Adjusted path according to new file location
const { orderSchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new order
router.post('/', validateRequest(orderSchema), async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    console.log(`Order added: ${order}`);
    res.status(201).send(order);
  } catch (error) {
    console.error(`Error adding new order: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('dealer vehicleType');
    console.log(`Fetched ${orders.length} orders`);
    res.json({ orders });
  } catch (error) {
    console.error(`Error fetching orders: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update an order
router.patch('/:id', validateRequest(orderSchema), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      console.log(`Order with id ${req.params.id} not found`);
      return res.status(404).send('Order not found');
    }
    console.log(`Order updated: ${order}`);
    res.send(order);
  } catch (error) {
    console.error(`Error updating order: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      console.log(`Order with id ${req.params.id} not found`);
      return res.status(404).send('Order not found');
    }
    console.log(`Order deleted: ${order}`);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting order: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;