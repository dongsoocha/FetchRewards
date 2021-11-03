const path = require('path');
const filename = path.join(__dirname, '../data/transactions.json');
let transactions = require(filename);
const helper = require("../helpers/helper.js");

function getPointsBalances() {
  return new Promise((resolve, reject) => {
    if (transactions.length === 0) {
      reject({
        message: "No points balences",
        status: 202,
      });
    }
    let payers = {};
    for (let transaction of transactions) {
        let payer = transaction.payer;
        payers[payer] ? payers[payer] += transaction.points : payers[payer] = transaction.points;
    }
    resolve(payers);
  });
}

function addTransaction(transaction) {
  return new Promise((resolve, reject) => {
    const date = helper.newDate();
    const newTransaction = {
      payer: transaction.payer,
      points: transaction.points,
      timestamp: date,
    };
    transactions.push(newTransaction);
    helper.writeToJSON(filename, transactions);
    resolve(newTransaction);
  });
}

function spendPoints(pointsAmount) {
  let sortedTransactions = transactions.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  return new Promise((resolve, reject) => {
    let start = 0;
    let payerAmounts = {};
    while (start < sortedTransactions.length && pointsAmount > 0) {
        const transactionValue = sortedTransactions[start].points;
        const payer = sortedTransactions[start].payer;
        sortedTransactions[start].points = 0;
        if (transactionValue === 0) {
            start++;
            continue;
        } 

        if (pointsAmount > transactionValue) {
            if (payerAmounts[payer]) {
                payerAmounts[payer].points -= transactionValue;
            } else {
                payerAmounts[payer] = {
                    payer: `${payer}`,
                    points: -transactionValue,
                };
            }
            pointsAmount -= transactionValue;
        } else {
            const spent = pointsAmount;
            pointsAmount = 0;
            if (payerAmounts[payer]) {
                payerAmounts[payer].points -= spent;
            } else {
                payerAmounts[payer] = {
                    payer: `${payer}`,
                    points: -spent,
                }
            }
        }
    }
    if (pointsAmount > 0) {
        reject({
            message: "Not enough points",
            status: 202,
        });
    } else {
        helper.writeToJSON(
            filename,
            sortedTransactions,
        )
        resolve(payerAmounts);
    }
  });
}

function cleanUsedPoints() {
  return new Promise((resolve, reject) => {
    if (transactions.length === 0) {
      reject({
        message: "No transactions",
        status: 202,
      });
    }

    helper.writeToJSON(
      filename,
      transactions.reject((transaction) => transaction.amount === 0)
    );
    resolve(transactions);
  });
}

module.exports = {
  getPointsBalances,
  addTransaction,
  spendPoints,
  cleanUsedPoints,
};
