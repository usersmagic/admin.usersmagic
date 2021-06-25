// Remove multiple users from waitlist using users field, return an error if it exists
// XMLHTTP Request

const async = require('async');

const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  User.removeMultipleUsersFromWaitlist(req.body, (err, users) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    async.timesSeries(
      users.length,
      (time, next) => {
        const user = users[time];

        sendMail({
          template: user.country == 'tr' ? 'waitlist_out_tr' : 'waitlist_out_en',
          name: user.name.split(' ')[0],
          to: user.email
        }, err => {
          if (err) console.log(err);
          
          return next(null);
        });
      },
      err => {
        if (err) {
          res.write(JSON.stringify({ error: err, success: false }));
          return res.end();
        }

        res.write(JSON.stringify({ success: true }));
        return res.end();
      }
    );
  });
}
