// Create a new Template document with the given data
// XMLHTTP Request

const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Template.createTemplate(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  });
}
