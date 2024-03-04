const express = require('express');
const Dealer = require('../../models/Dealer');
const { dealerSchema } = require('../../validation/schemas');
const validateRequest = require('../../middleware/validateRequest');
const router = express.Router();

// Add a new dealer
router.post('/', validateRequest(dealerSchema), async (req, res) => {
  try {
    const dealer = new Dealer(req.body);
    await dealer.save();
    console.log(`Dealer added: ${dealer.name}`);
    res.status(201).send(dealer);
  } catch (error) {
    console.error(`Error adding new dealer: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Get all dealers
router.get('/', async (req, res) => {
  try {
    const dealers = await Dealer.find({});
    console.log(`Fetched ${dealers.length} dealers`);
    res.json(dealers);
  } catch (error) {
    console.error(`Error fetching dealers: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a dealer
router.patch('/:id', validateRequest(dealerSchema), async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dealer) {
      console.log(`Dealer with id ${req.params.id} not found`);
      res.status(404).send('Dealer not found');
    } else {
      console.log(`Dealer updated: ${dealer.name}`);
      res.send(dealer);
    }
  } catch (error) {
    console.error(`Error updating dealer: ${error.message}`, error.stack);
    res.status(400).send(error.message);
  }
});

// Delete a dealer
router.delete('/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.id);
    if (!dealer) {
      console.log(`Dealer with id ${req.params.id} not found`);
      res.status(404).send('Dealer not found');
    } 
    console.log(`Dealer deleted: ${dealer.name}`);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting dealer: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;