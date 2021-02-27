// Get /edit page

const Country = require('../../../models/country/Country');
const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    Question.getQuestionById(req.query.id, (err, question) => {
      if (err) return res.redirect('/');
  
      return res.render('questions/edit', {
        page: 'questions/edit',
        title: question.name,
        includes: {
          external: {
            css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'inputListeners', 'confirm']
          }
        },
        admin: req.session.admin,
        question,
        countries,
        question_types: ['short_text', 'long_text', 'checked', 'radio', 'range']
      });
    });
  });
}
