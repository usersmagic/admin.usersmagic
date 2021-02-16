// Delete the admin with the given id on the query
// XMLHTTP Request

const Admin = require('../../../../models/admin/Admin');

module.exports = (req, res) => {
  Admin.deleteAdmin(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
