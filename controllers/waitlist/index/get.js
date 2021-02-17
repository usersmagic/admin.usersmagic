// Get /waitlist with given filters

const Country = require('../../../models/country/Country');
const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.getWaitlistUsers({}, {}, (err, users) => {
    if (err) return res.redirect('/');

    Country.getCountries((err, countries) => {
      if (err) return res.redirect('/');

      res.render('waitlist/index', {
        page: 'waitlist/index',
        title: res.__('Waitlist'),
        includes: {
          external: {
            css: ['general', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm']
          }
        },
        users,
        countries,
        genders: [
          {name: 'Female', id: 'female'},
          {name: 'Male', id: 'male'},
          {name: 'Other', id: 'other'},
          {name: 'Prefer not to say', id: 'not_specified'}
        ]
      });
    });
  });
}
