// Start the Template with the given id
// XMLHTTP Request

const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Template.startTemplate(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
