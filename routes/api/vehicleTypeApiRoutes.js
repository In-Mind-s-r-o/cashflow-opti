const express = require('express');
const VehicleType = require('../../models/VehicleType');
const { vehicleTypeSchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new vehicle type
router.post('/', validateRequest(vehicleTypeSchema), async (req, res) => {
  try {
    const vehicleType = new VehicleType(req.body);
    await vehicleType.save();
    console.log(`Vehicle type added: ${vehicleType.type}`);
    res.status(201).json(vehicleType);
  } catch (error) {
    console.error(`Error adding vehicle type: ${error.message}`, error.stack);
    res.status(400).json({ error: error.message });
  }
});

// Get all vehicle types
router.get('/', async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find({});
    console.log(`Fetched ${vehicleTypes.length} vehicle types`);
    res.json(vehicleTypes);
  } catch (error) {
    console.error(`Error fetching vehicle types: ${error.message}`, error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Update a vehicle type
router.patch('/:id', validateRequest(vehicleTypeSchema), async (req, res) => {
  try {
    const vehicleType = await VehicleType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicleType) {
      console.log(`Vehicle type with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Vehicle type not found.' });
    }
    console.log(`Vehicle type updated: ${vehicleType.type}`);
    res.json(vehicleType);
  } catch (error) {
    console.error(`Error updating vehicle type: ${error.message}`, error.stack);
    res.status(400).json({ error: error.message });
  }
});

// Delete a vehicle type
router.delete('/:id', async (req, res) => {
  try {
    const vehicleType = await VehicleType.findByIdAndDelete(req.params.id);
    if (!vehicleType) {
      console.log(`Vehicle type with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Vehicle type not found.' });
    }
    console.log(`Vehicle type deleted: ${vehicleType.type}`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting vehicle type: ${error.message}`, error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;