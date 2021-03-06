// Create a new Country document with request body
// XMLHTTP Request

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  Country.createCountry(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ success: false, error: err }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  })
}
