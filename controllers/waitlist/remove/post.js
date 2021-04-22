// Remove multiple users from waitlist using users field, return an error if it exists
// XMLHTTP Request

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.removeMultipleUsersFromWaitlist(req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
