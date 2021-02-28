// Start the given campaign in the query
// XMLHTTP Request

const Campaign = require('../../../models/campaign/Campaign');

module.exports = (req, res) => {
  Campaign.stopOrStartCampaign(req.query.id, 'start', err => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
