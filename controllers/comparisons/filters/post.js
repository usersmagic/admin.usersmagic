
const Question = require('../../../models/question/Question');

module.exports = (req, res) => {

  Question.createFilterGraph(req.body, (err, data) => {
    if (err) {
      res.write(JSON.stringify({success:false, error:err}));
      return res.end();
    }
    res.send(data);
  })
}