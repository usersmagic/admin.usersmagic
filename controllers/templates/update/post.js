// Update template information
// XMLHTTP request

const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Template.updateTemplate(req.query.id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
