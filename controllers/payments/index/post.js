// Get earliest 100 payments with the given filters
// XMLHTTP Request

const Payment = require('../../../models/payment/Payment');

module.exports = (req, res) => {
  Payment.findLatestPaymentsWithFilters(req.body, (err, payments) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ payments, success: true }));
    return res.end();
  });
}
