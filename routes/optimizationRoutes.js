const express = require('express');
const { optimizeProductionPlan } = require('../services/optimizationService');
const Order = require('../models/Order'); // Assuming this model exists
const Warehouse = require('../models/Warehouse'); // Assuming this model exists
const Dealer = require('../models/Dealer'); // Assuming this model exists

const router = express.Router();

router.post('/optimize', async (req, res) => {
    try {
        console.log('Starting optimization process...');
        // Fetch necessary data from database. This is a simplified example
        const orders = await Order.find().populate('vehicleType dealer').exec();
        const warehouses = await Warehouse.find().populate('assignedDealer').exec();
        const dealers = await Dealer.find().exec();

        console.log(`Fetched orders: ${orders.length}, warehouses: ${warehouses.length}, dealers: ${dealers.length}`);

        // Convert fetched data to the format expected by optimizeProductionPlan
        // This involves mapping and preprocessing the data accordingly
        // Placeholder for mapping and preprocessing - Implement as needed

        const optimizedPlan = optimizeProductionPlan(orders, warehouses, dealers);

        console.log('Optimization completed successfully.');
        res.json(optimizedPlan);
    } catch (error) {
        console.error('Error optimizing production plan:', error.message, error.stack);
        res.status(500).send('Failed to optimize production plan.');
    }
});

module.exports = router;