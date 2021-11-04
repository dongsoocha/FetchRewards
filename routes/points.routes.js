const express = require("express");
const router = express.Router();
const transaction = require("../models/transaction.model");
const m = require("../helpers/middlewares");

// Get list of all points
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

// Spend points
router.post("/", m.mustBeInteger, async (req, res) => {
  await transaction
    .spendPoints(req.body)
    .then((payerAmounts) =>
      res.status(201).json({
        message: `${req.body} points successfully spent!`,
        content: payerAmounts,
      })
    )
    .catch((err) => res.status(500).json({ message: err.message }));
});
module.exports = router;
