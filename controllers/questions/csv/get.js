// Get /questions/csv data of question

const json2csv = require('json-2-csv');

const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Question.getQuestionJSONByAges(req.query.id, (err, data) => {
    console.log(data);
    if (err) return res.json({ error: err });

    json2csv.json2csv(data, (err, csv) => {
      if (err) return res.redirect('/');

      return res.attachment('Question Results.csv').send(csv);
    });
  })
}
