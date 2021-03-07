// Approve the Target with the given id on query
// XMLHTTP Request

const Target = require('../../../models/target/Target');

module.exports = (req, res) => {
  Target.approveTarget(req.query.id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
