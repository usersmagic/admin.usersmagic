// Get list of admins matching giving query
// XMLHTTP Request

const Admin = require('../../../../models/admin/Admin');

module.exports = (req, res) => {
  Admin.getAdminsByFilters(req.query, (err, admins) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ admins, success: true }));
    return res.end();
  });
}
