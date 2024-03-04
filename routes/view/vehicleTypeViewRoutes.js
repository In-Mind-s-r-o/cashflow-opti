const express = require('express');
const VehicleType = require('../../models/VehicleType'); // Corrected the path
const { vehicleTypeSchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new vehicle type
router.post('/vehicle-types', validateRequest(vehicleTypeSchema), async (req, res) => {
  try {
    const vehicleType = new VehicleType(req.body);
    await vehicleType.save();
    console.log(`Vehicle type added: ${vehicleType.type}`);
    res.redirect('/vehicle-types');
  } catch (error) {
    console.error(`Error adding vehicle type: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all vehicle types
router.get('/vehicle-types', async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find({});
    console.log(`Fetched ${vehicleTypes.length} vehicle types`);
    res.render('vehicleTypes', { vehicleTypes });
  } catch (error) {
    console.error(`Error fetching vehicle types: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Route to show form for adding a new vehicle type
router.get('/vehicle-types/new', (req, res) => {
  res.render('vehicleTypeForm', { vehicleType: null });
});

// Get a vehicle type by id
router.get('/vehicle-types/:id', async (req, res) => {
  try {
    const vehicleType = await VehicleType.findById(req.params.id);
    if (!vehicleType) {
      return res.status(404).send('Vehicle type not found.');
    }
    res.render('vehicleTypeForm', { vehicleType });
  } catch (error) {
    console.error(`Error fetching vehicle type: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a vehicle type
router.patch('/vehicle-types/:id', validateRequest(vehicleTypeSchema), async (req, res) => {
  try {
    const vehicleType = await VehicleType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicleType) {
      console.log(`Vehicle type with id ${req.params.id} not found`);
      return res.status(404).send('Vehicle type not found.');
    }
    console.log(`Vehicle type updated: ${vehicleType.type}`);
    res.redirect('/vehicle-types');
  } catch (error) {
    console.error(`Error updating vehicle type: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Delete a vehicle type
router.delete('/vehicle-types/:id', async (req, res) => {
  try {
    const vehicleType = await VehicleType.findByIdAndDelete(req.params.id);
    if (!vehicleType) {
      console.log(`Vehicle type with id ${req.params.id} not found`);
      res.redirect('/vehicle-types');
    }
    console.log(`Vehicle type deleted: ${vehicleType.type}`);
    res.redirect('/vehicle-types');
  } catch (error) {
    console.error(`Error deleting vehicle type: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;