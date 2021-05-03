// Get / page

const Campaign = require('../../../models/campaign/Campaign');
const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    Campaign.getCampaigns((err, campaigns) => {
      if (err) return res.redirect('/');
  
      return res.render('campaigns/index', {
        page: 'campaigns/index',
        title: res.__('Campaigns'),
        includes: {
          external: {
            css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
          }
        },
        admin: req.session.admin,
        countries,
        campaigns,
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
