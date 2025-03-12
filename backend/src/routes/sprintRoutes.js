const express = require('express');
const router = express.Router();

// Define sprint routes here
router.get('/', (req, res) => {
  res.send('Sprint route working!');
});

module.exports = router;