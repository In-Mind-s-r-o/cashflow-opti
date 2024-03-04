const express = require('express');
const Country = require('../../models/Country');
const Dealer = require('../../models/Dealer'); // Assuming Dealer model exists
const { countrySchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new country
router.post('/', validateRequest(countrySchema), async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    console.log(`New country added: ${country.name}`);
    res.status(201).send(country);
  } catch (error) {
    console.error(`Error adding new country: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all countries
router.get('/', async (req, res) => {
  try {
    console.log(`Fetched ${countries.length} countries`);
    res.json(countries);
  } catch (error) {
    console.error(`Error fetching countries: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a country
router.patch('/:id', validateRequest(countrySchema), async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!country) {
      console.log(`Country with id ${req.params.id} not found`);
      return res.status(404).send('Country not found');
    }
    console.log(`Country updated: ${country.name}`);
    res.send(country);
  } catch (error) {
    console.error(`Error updating country: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Delete a country
router.delete('/:id', async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      console.log(`Country with id ${req.params.id} not found`);
      return res.status(404).send('Country not found');
    }
    console.log(`Country deleted: ${country.name}`);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting country: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;