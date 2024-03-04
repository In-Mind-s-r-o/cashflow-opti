const express = require('express');
const Dealer = require('../../models/Dealer');
const { countries } = require('countries-list');
const { dealerSchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new dealer
router.post('/dealers', validateRequest(dealerSchema), async (req, res) => {
  try {
    const dealer = new Dealer(req.body);
    await dealer.save();
    console.log(`Dealer added: ${dealer.name}`);
    res.redirect('/dealers');
  } catch (error) {
    console.error(`Error adding new dealer: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all dealers
router.get('/dealers', async (req, res) => {
  try {
    const dealers = await Dealer.find({});
    console.log(`Fetched ${dealers.length} dealers`);
    res.render('dealers', { dealers });
  } catch (error) {
    console.error(`Error fetching dealers: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Route to show form for adding a new dealer
router.get('/dealers/new', (req, res) => {
  res.render('dealerForm', { dealer: null, countries });
});

// Get a dealer by id
router.get('/dealers/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer) {
      return res.status(404).send('Dealer not found.');
    }
    res.render('dealerForm', { dealer, countries });
  } catch (error) {
    console.error(`Error fetching vehicle type: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a dealer
router.patch('/dealers/:id', validateRequest(dealerSchema), async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dealer) {
      console.log(`Dealer with id ${req.params.id} not found`);
      return res.status(404).send('Dealer not found');
    }
    console.log(`Dealer updated: ${dealer.name}`);
    res.redirect('/dealers');
  } catch (error) {
    console.error(`Error updating dealer: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});


// Delete a dealer
router.delete('/dealers/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.id);
    if (!dealer) {
      console.log(`Dealer with id ${req.params.id} not found`);
      res.redirect('/dealers');
    }
    console.log(`Dealer deleted: ${dealer.type}`);
    res.redirect('/dealers');
  } catch (error) {
    console.error(`Error deleting dealer: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;