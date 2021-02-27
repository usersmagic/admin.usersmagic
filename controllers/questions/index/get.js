// Get / page

const Country = require('../../../models/country/Country');
const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    Question.findQuestion(req.query, req.query, (err, data) => {
      if (err) return res.redirect('/');
  
      return res.render('questions/index', {
        page: 'questions/index',
        title: 'Questions',
        includes: {
          external: {
            css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
          }
        },
        admin: req.session.admin,
        countries,
        questions: data.questions,
        filters: data.filters,
        options: data.options,
        question_types: ['short_text', 'long_text', 'checked', 'radio', 'range']
      });
    });
  });
}
