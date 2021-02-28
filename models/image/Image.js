const async = require('async');
const mongoose = require('mongoose');

const deleteImage = require('./functions/deleteImage');
const uploadImage = require('./functions/uploadImage');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    // The url of the image, a link on the AWS database
    type: String,
    required: true,
    unique: true
  },
  unixtime: {
    // The unix creation time of the document
    type: Number,
    default: (new Date()).getTime()
  },
  is_used: {
    // The info if the image is used or not
    type: Boolean,
    default: false
  }
});

ImageSchema.statics.deleteImageByUrl = function (url, callback) {
  // Deletes the document from the mongo and the AWS database with the given url, returns error if there is one
  
  if (!url)
    return callback('bad_request');
    
  const Image = this;

  deleteImage(url, err => {
    if (err) return callback(err);

    Image.findOneAndDelete({url}, err => {
      if (err) return callback(err);

      return callback(null);
    });
  });
}

ImageSchema.statics.deleteOldImages = function (callback) {
  // Delete maximum of 100 documents from the database that have the fields is_used: false and unixtime smaller than the current time plus autoDeleteTime
  
  const currTime = (new Date()).getTime();
  const autoDeleteTime = 7200000; // 2 hours

  const Image = this;

  Image
    .find({
      is_used: false,
      unixtime: {$lt: currTime - autoDeleteTime}
    })
    .limit(100)
    .then(images => {
      console.log(images);
      async.timesSeries(
        images.length,
        (time, next) => Image.findByIdAndDelete(mongoose.Types.ObjectId(images[time]._id), err => next(err)),
        err => {
          if (err) return callback(err);

          return callback(null);
        }
      );
    })
    .catch(err => {
      return callback(err);
    })
}

ImageSchema.statics.createImage = function (file_name, callback) {
  // Creates a new image document and uploads the data on the AWS database
  // Returns the url of the image or an error, if there is one

  if (!file_name)
    return callback('bad_request');

  const Image = this;

  uploadImage(file_name, (err, url) => {
    if (err) return callback(err);

    const newImageData = { url };
    const newImage = new Image(newImageData);

    newImage.save((err, image) => {
      if (err) return callback(err);

      return callback(null, image.url);
    });
  });
}

ImageSchema.statics.indexDocuments = function () {
  // Index the model with fields is_used and unixtime

  
}

module.exports = mongoose.model('Image', ImageSchema);
