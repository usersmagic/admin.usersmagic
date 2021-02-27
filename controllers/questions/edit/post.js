// Update the Question document with the given id on query
// XMLHTTP Request

const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Question.updateQuestion(req.query.id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
