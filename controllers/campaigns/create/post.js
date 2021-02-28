// Create a new Campaign document with the given data
// XMLHTTP Request

const Campaign = require('../../../models/campaign/Campaign');

module.exports = (req, res) => {
  Campaign.createCampaign(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  });
}
