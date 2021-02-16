// Create a new admin with the given data on body
// XMLHTTP Request

const Admin = require('../../../../models/admin/Admin');

module.exports = (req, res) => {
  Admin.createAdmin(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ id, success: true }));
    return res.end();
  });
}
