const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({dest: './public/res/uploads/'});

const isLoggedIn = require('../middleware/isLoggedIn');

const deletePostController = require('../controllers/image/delete/post');
const uploadPostController = require('../controllers/image/upload/post');

router.post(
  '/delete',
    isLoggedIn,
    deletePostController
);
router.post(
  '/upload',
    upload.single('file'),
    isLoggedIn,
    uploadPostController
)

module.exports = router;
