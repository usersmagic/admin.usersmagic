// Get /update page of the template using id on query

const Country = require('../../../models/country/Country');
const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Country.getAllCountries((err, countries) => {
    if (err) return res.redirect('/');

    Template.getTemplateById(req.query.id, (err, template) => {
      if (err) return res.redirect('/');
  
      return res.render('templates/update', {
        page: 'templates/update',
        title: res.__('Templates'),
        includes: {
          external: {
            css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'inputListeners', 'confirm']
          }
        },
        admin: req.session.admin,
        countries,
        template
      });
    });
  });
}
