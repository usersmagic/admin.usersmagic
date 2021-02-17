// Get users on waitlist by filters
// XMLHTTP Request

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.getWaitlistUsers(req.body, req.query, (err, users) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ users, success: true }));
    return res.end();
  });
}
