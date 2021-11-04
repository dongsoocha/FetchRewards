const path = require("path");
const filename = path.join(__dirname, "../data/transactions.json");
let transactions = require(filename);
const helper = require("../helpers/helper.js");

function getPointsBalances() {
  return new Promise((resolve, reject) => {
    if (transactions.length === 0) {
      reject({
        message: "No points balances",
        status: 202,
      });
    }
    let payers = {};
    for (let transaction of transactions) {
      let payer = transaction.payer;
      payers[payer]
        ? (payers[payer] += transaction.points)
        : (payers[payer] = transaction.points);
    }
    resolve(payers);
  });
}

function getPointsForNegTest() {
  let payers = {};
  for (let transaction of transactions) {
    let payer = transaction.payer;
    payers[payer]
      ? (payers[payer] += transaction.points)
      : (payers[payer] = transaction.points);
  }
  return payers;
}

function addTransaction(transaction) {
  return new Promise((resolve, reject) => {
    const date = transaction.date ? transaction.date : helper.newDate();
    if (transaction.payer && transaction.points) {
      const newTransaction = {
        payer: transaction.payer,
        points: transaction.points,
        timestamp: date,
      };
      transactions.push(newTransaction);
      helper.writeToJSON(filename, transactions);
      resolve(newTransaction);
    } else {
      reject({
        message: "One or more fields are empty",
        status: 202,
      });
    }
  });
}

function spendPoints(pointsAmount) {
  let sortedTransactions = JSON.parse(JSON.stringify(transactions)).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  pointsAmount = parseInt(pointsAmount.points);
  const payers = getPointsForNegTest();
  return new Promise((resolve, reject) => {
    let start = 0;
    let payerAmounts = {};
    let negatives = false;
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
        sortedTransactions[start].points = transactionValue - spent;
        if (payerAmounts[payer]) {
          payerAmounts[payer].points -= spent;
        } else {
          payerAmounts[payer] = {
            payer: `${payer}`,
            points: -spent,
          };
        }
      }
      start++;
      if (payers[payer] - payerAmounts[payer] < 0) {
        negatives = true;
        break;
      }
    }
    if (pointsAmount > 0 || negatives) {
      reject({
        message: "Not enough points",
        status: 202,
      });
    } else {
      transactions = sortedTransactions;
      helper.writeToJSON(filename, sortedTransactions);
      resolve(Object.values(payerAmounts));
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
    let valid = [];
    let filtered = [];
    for (let transaction of transactions) {
      transaction.points !== 0
        ? valid.push(transaction)
        : filtered.push(transaction);
    }
    helper.writeToJSON(filename, valid);
    resolve(filtered);
  });
}

module.exports = {
  getPointsBalances,
  addTransaction,
  spendPoints,
  cleanUsedPoints,
};
