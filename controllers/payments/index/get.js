// Get /payments route

const Payment = require('../../../models/payment/Payment');

module.exports = (req, res) => {
  Payment.findLatestPayments((err, payments) => {
    if (err) return res.redirect('/admin');

    return res.render('payments/index', {
      page: 'payments/index',
      title: res.__('Payments'),
      includes: {
        external: {
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content'],
          js: ['page', 'serverRequest']
        }
      },
      admin: req.session.admin,
      payments
    });
  });
}
