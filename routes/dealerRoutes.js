const express = require('express');
const Dealer = require('../models/Dealer');
const { dealerManagementSchema } = require('../validation/schemas');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();

// Add a new dealer
router.post('/dealers', validateRequest(dealerManagementSchema), async (req, res) => {
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
router.get('/dealers', async (req, res) => {
  try {
    const dealers = await Dealer.find({});
    console.log(`Fetched ${dealers.length} dealers`);
    res.status(200).send(dealers);
  } catch (error) {
    console.error(`Error fetching dealers: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update a dealer
router.patch('/dealers/:id', validateRequest(dealerManagementSchema), async (req, res) => {
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
router.delete('/dealers/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.id);
    if (!dealer) {
      console.log(`Dealer with id ${req.params.id} not found`);
      res.status(404).send('Dealer not found');
    } else {
      console.log(`Dealer deleted: ${dealer.name}`);
      res.send(dealer);
    }
  } catch (error) {
    console.error(`Error deleting dealer: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Dealer management form
router.get('/dealers/manage', async (req, res) => {
  try {
    const dealers = await Dealer.find({});
    res.render('dealers', { dealers });
  } catch (error) {
    console.error(`Error loading dealer management form: ${error.message}`, error.stack);
    res.status(500).send('Error loading dealer management form');
  }
});

router.post('/dealers/manage', validateRequest(dealerManagementSchema), async (req, res) => {
  try {
    let dealer = await Dealer.findOne({ name: req.body.name, country: req.body.country });
    if (dealer) {
      dealer.averageInvoiceMaturityDays = req.body.averageInvoiceMaturityDays;
      dealer.averageDeliveryTime = req.body.averageDeliveryTime;
      await dealer.save();
      console.log(`Dealer updated: ${dealer.name}`);
    } else {
      dealer = new Dealer(req.body);
      await dealer.save();
      console.log(`Dealer added: ${dealer.name}`);
    }
    res.redirect('/dealers/manage');
  } catch (error) {
    console.error(`Error managing dealers: ${error.message}`, error.stack);
    res.status(500).send('Error managing dealer data');
  }
});

module.exports = router;