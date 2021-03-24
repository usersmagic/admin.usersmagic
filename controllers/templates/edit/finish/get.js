// Finish template with specified id on query, set its status as waiting
// XMLHTTP request

const Template = require('../../../../models/template/Template');

module.exports = (req, res) => {
  Template.finishTemplate(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
