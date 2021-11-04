const express = require('express');
const router = express.Router();
module.exports = router;

router.use('/api/transactions', require('./transaction.routes'));
router.use('/api/points', require('./points.routes'));