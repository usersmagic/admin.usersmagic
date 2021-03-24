// Decrease the order of the Template by one with the given id on query
// XMLHTTP Request

const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Template.decreaseOrderByOne(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
};
