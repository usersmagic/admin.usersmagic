
const Question = require('../../../models/question/Question');

module.exports = (req, res) => {

  if (!req.body) req.body = {};

  Question.createFilterGraph(req.body, (err, data) => {
    if (err) {
      res.write(JSON.stringify({success:false, error:err}));
      return res.end();
    }
    res.send(data);
  })
}