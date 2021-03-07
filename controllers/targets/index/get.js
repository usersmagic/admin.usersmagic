// Get /targets

const Target = require('../../../models/target/Target');

module.exports = (req, res) => {
  Target.getWaitingTargets((err, targets) => {
    if (err) return res.redirect('/');

    return res.render('targets/index', {
      page: 'targets/index',
      title: res.__('Targets'),
      includes: {
        external: {
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
        }
      },
      admin: req.session.admin,
      targets
    });
  });
}
