// Get the questions to add to campaign
// XMLHTTP Request

const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Question.findQuestion(req.query, req.query, (err, data) => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, questions: data.questions }));
    return res.end();
  });
}
