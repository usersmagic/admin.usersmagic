// Approve the Submition with the given id
// XMLHTTP Request

const Submition = require('../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.approveSubmitionById(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
