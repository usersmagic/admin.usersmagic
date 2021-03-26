// Get /templates page with all Template

const Country = require('../../../models/country/Country');
const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  Country.getAllCountries((err, countries) => {
    if (err) return res.redirect('/');

    Template.getTemplates({}, (err, templates) => {
      if (err) return res.redirect('/');

      return res.render('templates/index', {
        page: 'templates/index',
        title: res.__('Templates'),
        includes: {
          external: {
            css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
          }
        },
        countries,
        templates
      });
    });
  });
}
