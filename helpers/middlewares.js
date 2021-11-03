// Primitive validation for transaction amounts/ points spend amounts
function mustBeInteger(req, res, next) {
    const points = req.body.points;

    if (!Number.isInteger(parseInt(points))) {
        res.status(400).json({message: 'Points must be integer'});
    } else {
        next();
    }
}

// Primitive validation to check validity of transaction
function checkTransaction(req, res, next) {
    const {payer, points, timestamp} = req.body;

    if (payer && points && timestamp) {
        next();
    } else {
        res.status(400).json({ message: 'one or more fields are empty'})
    }
}

module.exports = {
    mustBeInteger,
    checkTransaction
}