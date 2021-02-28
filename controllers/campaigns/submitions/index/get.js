// Get /campaign/submitions page with the submitions with the given limit, page and id on query

const Campaign = require('../../../../models/campaign/Campaign');
const Submition = require('../../../../models/submition/Submition');

module.exports = (req, res) => {
  Campaign.getCampaignById(req.query.id, (err, campaign) => {
    if (err) return res.redirect('/campaigns');
    
    Submition.getSubmitionsByProjectId(req.query, (err, submitions) => {
      if (err) return res.redirect('/campaigns');
  
      return res.render('campaigns/submitions', {
        page: 'campaigns/submitions',
        title: res.__('Submitions'),
        includes: {
          external: {
            css: ['general', 'page', 'auth', 'inputs', 'buttons', 'fontawesome', 'content', 'confirm'],
            js: ['page', 'serverRequest', 'contentListeners', 'inputListeners', 'confirm', 'utilityFunctions']
          }
        },
        admin: req.session.admin,
        submitions,
        campaign
      });
    });
  });
}
