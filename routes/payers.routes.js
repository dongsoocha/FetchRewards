const express = require("express");
const router = express.Router();
const transaction = require("../models/transaction.model");
const m = require("../helpers/middlewares");

// All payer amounts
router.get("/", async (req, res) => {
  await transaction
    .getPointsBalances()
    .then((payers) => res.json(payers))
    .catch((err) => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

module.exports = router;