const express = require('express');
const Warehouse = require('../../models/Warehouse');
const Dealer = require('../../models/Dealer'); // Assuming Dealer model exists
const { warehouseSchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new warehouse
router.post('/', validateRequest(warehouseSchema), async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    console.log(`New warehouse added: ${warehouse.name}`);
    res.status(201).send(warehouse);
  } catch (error) {
    console.error(`Error adding new warehouse: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await Warehouse.find({}).populate('assignedDealer');
    console.log(`Fetched ${warehouses.length} warehouses`);
    res.json(warehouses);
  } catch (error) {
    console.error(`Error fetching warehouses: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a warehouse
router.patch('/:id', validateRequest(warehouseSchema), async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warehouse) {
      console.log(`Warehouse with id ${req.params.id} not found`);
      return res.status(404).send('Warehouse not found');
    }
    console.log(`Warehouse updated: ${warehouse.name}`);
    res.send(warehouse);
  } catch (error) {
    console.error(`Error updating warehouse: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Delete a warehouse
router.delete('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      console.log(`Warehouse with id ${req.params.id} not found`);
      return res.status(404).send('Warehouse not found');
    }
    console.log(`Warehouse deleted: ${warehouse.name}`);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting warehouse: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;