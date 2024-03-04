const express = require('express');
const { countries } = require('countries-list'   );
const Country = require('../../models/Country'); // Corrected the path
const { countrySchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new country
router.post('/countries', validateRequest(countrySchema), async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    console.log(`Country added: ${country.type}`);
    res.redirect('/countries');
  } catch (error) {
    console.error(`Error adding country: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find({});
    console.log(`Fetched ${countries.length} countries`);
    res.render('countries', { countries });
  } catch (error) {
    console.error(`Error fetching countries: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Route to show form for adding a new country
router.get('/countries/new', (req, res) => {
  res.render('countryForm', { country: null, countries });
});

// Get a country by id
router.get('/countries/:id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).send('Country not found.');
    }
    res.render('countryForm', { country, countries });
  } catch (error) {
    console.error(`Error fetching country: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a country
router.patch('/countries/:id', validateRequest(countrySchema), async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!country) {
      console.log(`Country with id ${req.params.id} not found`);
      return res.status(404).send('Country not found.');
    }
    console.log(`Country updated: ${country.type}`);
    res.redirect('/countries');
  } catch (error) {
    console.error(`Error updating country: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Delete a country
router.delete('/countries/:id', async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) {
      console.log(`Country with id ${req.params.id} not found`);
      res.redirect('/countries');
    }
    console.log(`Country deleted: ${country.type}`);
    res.redirect('/countries');
  } catch (error) {
    console.error(`Error deleting country: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;