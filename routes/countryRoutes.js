const express = require('express');
const router = express.Router();

// Placeholder for demonstration purposes
// In a real application, this would interact with the database
let countriesData = [];

router.get('/countries', (req, res) => {
  // Render the form with any existing countries data (simulated here as an empty array for simplicity)
  res.render('countries', { countries: countriesData });
});

router.post('/countries', async (req, res) => {
  try {
    // Simulate saving the country data received from the form
    // In a real application, this data would be validated and saved to a database
    const { countryName, vehicleTypesOrdered, totalPrice } = req.body;
    countriesData.push({ countryName, vehicleTypesOrdered, totalPrice }); // This is a placeholder operation
    console.log(`Country data added: ${JSON.stringify(req.body)}`);
    res.redirect('/countries');
  } catch (error) {
    console.error(`Error managing countries: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Error managing country data');
  }
});

module.exports = router;