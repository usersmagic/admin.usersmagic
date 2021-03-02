// Approve the payment with the given id on query

const Payment = require('../../../models/payment/Payment');

module.exports = (req, res) => {
  Payment.approvePayment(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
