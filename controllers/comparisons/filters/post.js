
const User = require('../../../models/user/User');

module.exports = (req, res) => {

  if (!req.body) req.body = {};

  if (!req.body.firstQuestionId || !req.body.secondQuestionId) {
    res.write(JSON.stringify({success:false, error:err}));
    return res.end();
  }

  const yQuestionId = req.body.firstQuestionId;
  const xQuestionId = req.body.secondQuestionId;

  User.createFilterGraph(yQuestionId, xQuestionId, (err, data) => {
    if (err) {
      res.write(JSON.stringify({success:false, error:err}));
      return res.end();
    }
    res.send(data);
  })
}