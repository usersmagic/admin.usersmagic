// Get /submitions page

const Submition = require('../../../models/submition/Submition');

module.exports = (req, res) => {
  Submition.getWaitingSubmitions((err, submitions) => {
    if (err) return res.redirect('/');

    return res.render('submitions/index', {
      page: 'submitions/index',
      title: res.__('Submitions'),
      includes: {
        external: {
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
        }
      },
      admin: req.session.admin,
      submitions
    });
  });
}
