# FetchRewards Backend Coding Challenge

This is the coding challenge for the Backend Apprenticeship position at Fetch Rewards.

Author: Dongsoo Cha

# Task
Implement a web service that allows users to add transactions that contain the payer name, points amount, and date, spend the points starting from oldest to newest points, and get points balances for everyone in the database. I ended up adding an additional feature that flushes out the transactions whose points have already been used (for testing purposes). 

# Setup

## Pre-requisites for Setup
This project uses node and npm.

```
$ node -v
$ npm -v
```
If you don't have these installed, refer to this [guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Project Setup
Clone the repository:

```
$ git clone https://github.com/dongsoocha/FetchRewards/
```
After confirming everything is installed, run `$ npm install` in the root directory of the folder to download dependencies.
Once everything is installed, run `$ npm run start` to start the server and begin using this service!

# Usage:
### Note:
The data from the challenge is contained in /data/seed.json. To prepopulate the server without having to manually add all transactions through the API calls, copy paste the data in seed.json over to data/transactions.json. This will let you immediately test spending and getting points balances without getting a 'Not enough points' or 'No points balances' errors.

To fetch user point balances:

* ```GET api/points```

* ```$ curl -i -X GET http://localhost:5000/api/points```

To add a transaction:

* ```POST api/transactions```

* ```$ curl -i -X POST -H 'Content-Type: application/json' -d '{"payer": "DANNON", "points": 500}' http://localhost:5000/api/transactions```

To spend points: 

* ```POST api/points```

* ```$ curl -i -X POST -H 'Content-Type: application/json' -d '{"points": 5000}' http://localhost:5000/api/points```

To flush used points from the list of transactions: 

* ```POST api/transactions/flush```

* ```$ curl -i -X POST http://localhost:5000/api/transactions/flush```
