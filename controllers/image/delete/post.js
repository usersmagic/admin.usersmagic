// Deletes the image with the given url
// XMLHTTP request

const Image = require('../../../models/image/Image');

module.exports = (req, res) => {
  Image.deleteImageByUrl(req.body ? req.body.url : null, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
