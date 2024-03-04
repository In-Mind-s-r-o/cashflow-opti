const express = require('express');
const Warehouse = require('../models/Warehouse');
const Dealer = require('../models/Dealer'); // Assuming Dealer model exists
const { warehouseSchema } = require('../validation/schemas');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();

// Add a new warehouse
router.post('/warehouses', validateRequest(warehouseSchema), async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    console.log(`New warehouse added: ${warehouse.name}`);
    res.status(201).send(warehouse);
  } catch (error) {
    console.error(`Error adding new warehouse: ${error.message}`, error.stack);
    res.status(400).send(error);
  }
});

// Get all warehouses
router.get('/warehouses', async (req, res) => {
  try {
    const warehouses = await Warehouse.find({}).populate('assignedDealer');
    console.log(`Fetched ${warehouses.length} warehouses`);
    res.status(200).send(warehouses);
  } catch (error) {
    console.error(`Error fetching warehouses: ${error.message}`, error.stack);
    res.status(500).send(error);
  }
});

// Update a warehouse
router.patch('/warehouses/:id', validateRequest(warehouseSchema), async (req, res) => {
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
    res.status(400).send(error);
  }
});

// Delete a warehouse
router.delete('/warehouses/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      console.log(`Warehouse with id ${req.params.id} not found`);
      return res.status(404).send('Warehouse not found');
    }
    console.log(`Warehouse deleted: ${warehouse.name}`);
    res.send(warehouse);
  } catch (error) {
    console.error(`Error deleting warehouse: ${error.message}`, error.stack);
    res.status(500).send(error);
  }
});

// Management routes for warehouse
router.get('/warehouses/manage', async (req, res) => {
  try {
    // Fetch dealers data to populate the dropdown
    const dealers = await Dealer.find({});
    res.render('warehouses', { dealers });
  } catch (error) {
    console.error(`Error displaying warehouses form: ${error.message}`, error.stack);
    res.status(500).send('Error fetching dealers for warehouse form');
  }
});

router.post('/warehouses/manage', validateRequest(warehouseSchema), async (req, res) => {
  try {
    // Logic to save or update warehouse data
    const { name, assignedDealer, averageWaitingTimeDays, maximumVehicleCapacity } = req.body;
    let warehouse = await Warehouse.findOne({ name });
    if (warehouse) {
      warehouse.assignedDealer = assignedDealer;
      warehouse.averageWaitingTimeDays = averageWaitingTimeDays;
      warehouse.maximumVehicleCapacity = maximumVehicleCapacity;
      await warehouse.save();
      console.log(`Warehouse updated: ${warehouse.name}`);
    } else {
      warehouse = new Warehouse({ name, assignedDealer, averageWaitingTimeDays, maximumVehicleCapacity });
      await warehouse.save();
      console.log(`New warehouse added: ${warehouse.name}`);
    }
    res.redirect('/warehouses/manage');
  } catch (error) {
    console.error(`Error managing warehouses: ${error.message}`, error.stack);
    res.status(500).send('Error managing warehouse data');
  }
});

module.exports = router;