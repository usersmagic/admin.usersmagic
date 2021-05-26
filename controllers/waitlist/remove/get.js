// Remove the given user from waitlist, return an error if it exists
// XMLHTTP Request

const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  User.removeUserFromWaitlist(req.query.id, (err, user) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    sendMail({
      template: user.country == 'tr' ? 'waitlist_out_tr' : 'waitlist_out_en',
      name: user.name.split(' ')[0],
      to: user.email
    }, err => {
      if (err) {
        res.write(JSON.stringify({ error: 'email_error', success: false }));
        return res.end();
      }
      
      res.write(JSON.stringify({ success: true }));
      return res.end();
    });
  })
}
