const Admin = require('../../../models/admin/Admin');

module.exports = (req, res) => {
  Admin.findAdmin(req.body, (err, admin) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    req.session.admin = admin;
    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
