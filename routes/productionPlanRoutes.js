const express = require('express');
const router = express.Router();

router.get('/api/production-plan', (req, res) => {
    try {
      const cfg = {
        type: 'line',
        data: {
          datasets: [{
            data: [{x: 10, y: 20}, {x: 15, y: null}, {x: 20, y: 10}]
          }]
        }
      };
      console.log('Serving production plan data');
      res.json(cfg);
    } catch (error) {
      console.error('Error serving production plan data:', error.message, error.stack);
      res.status(500).send('Failed to serve production plan data.');
    }
});

module.exports = router;