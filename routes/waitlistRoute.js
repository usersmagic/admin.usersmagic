const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/waitlist/index/get');
const removeGetController = require('../controllers/waitlist/remove/get');

const indexPostController = require('../controllers/waitlist/index/post');

router.get(
  '/',
    isLoggedIn,
    indexGetController
);
router.get(
  '/remove',
    isLoggedIn,
    removeGetController
);

router.post(
  '/',
    isLoggedIn,
    indexPostController
);

module.exports = router;
