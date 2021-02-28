// Creates a new image document and returns the new image url
// XMLHTTP request

const Image = require('../../../models/image/Image');

module.exports = (req, res) => {
  Image.createImage(req.file ? req.file.filename : null, (err, url) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ url, success: true }));
    return res.end();
  });
}
