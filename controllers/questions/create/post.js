// Create a new Question document with the given data
// XMLHTTP Request

const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Question.createQuestion(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  });
}
