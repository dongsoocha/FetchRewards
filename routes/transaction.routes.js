const express = require('express');
const router = express.Router();
const transaction = require('../models/transaction.model');
const m = require('../helpers/middlewares');



// Add a transaction
router.post('/', m.checkTransaction, m.mustBeInteger, async(req, res) => {
    await transaction.addTransaction(req.body)
    .then(transaction => res.status(201).json({
        message: `Transaction successfully added!`,
        content: transaction,
    }))
    .catch(err => res.status(500).json({message: err.message}))
})

module.exports = router;

