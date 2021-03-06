// Get /countries page

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  Country.getAllCountries((err, countries) => {
    if (err) return res.redirect('/');

    return res.render('countries/index', {
      page: 'countries/index',
      title: res.__('Countries'),
      includes: {
        external: {
          css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
          js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
        }
      },
      admin: req.session.admin,
      countries
    });
  });
}
