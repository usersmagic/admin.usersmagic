// Get /edit page of the template using id on query

const Template = require('../../../../models/template/Template');

module.exports = (req, res) => {
  Template.getTemplateById(req.query.id, (err, template) => {
    if (err) return res.redirect('/');

    return res.render('templates/edit', {
      page: 'templates/edit',
      title: res.__('Templates'),
      includes: {
        external: {
          css: ['page', 'general', 'header', 'confirm', 'logo', 'inputs', 'buttons', 'fontawesome'],
          js: ['page', 'duplicateElement', 'confirm', 'dragAndDrop', 'buttonListeners', 'headerListeners']
        }
      },
      admin: req.session.admin,
      template
    });
  })
}
