// Get /edit page

const Question = require('../../../models/question/Question');

module.exports = (req, res) => {
  Question.getQuestionById(req.query.id, (err, question) => {
    if (err) return res.redirect('/');

    return res.render('questions/edit', {
      page: 'questions/edit',
      title: question.name,
      includes: {
        external: {
          css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm']
        }
      },
      admin: req.session.admin,
      question
    });
  });
}
