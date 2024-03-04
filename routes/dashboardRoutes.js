const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', (err, html) => {
        if (err) {
            console.error('Error rendering dashboard:', err.message, err.stack);
            return res.status(500).send('Error rendering dashboard page.');
        }
        res.send(html);
    });
});

module.exports = router;