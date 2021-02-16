// Get /root_admin/admins page, with all the admins in alphabetical order

const Admin = require('../../../../models/admin/Admin');
const Country = require('../../../../models/country/Country');

module.exports = (req, res) => {
  Admin.getAdminsByFilters({}, (err, admins) => {
    if (err) return res.redirect('/root_admin');

    Country.getCountries((err, countries) => {
      if (err) return res.redirect('/root_admin');

      return res.render('root_admin/admins', {
        page: 'root_admin/admins',
        title: res.__('Admins'),
        includes: {
          external: {
            css: ['page', 'general', 'content', 'inputs', 'buttons', 'fontawesome', 'confirm'],
            js: ['page', 'inputListeners', 'contentListeners', 'serverRequest', 'confirm']
          }
        },
        admins,
        countries
      });
    });
  });
}
