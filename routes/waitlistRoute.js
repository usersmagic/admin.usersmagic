const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/waitlist/index/get');
const removeGetController = require('../controllers/waitlist/remove/get');

const indexPostController = require('../controllers/waitlist/index/post');
const removePostController = require('../controllers/waitlist/remove/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);
router.get(
  '/remove',
    isLoggedIn,
    checkAdminRolePermissions,
    removeGetController
);

router.post(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexPostController
);
router.post(
  '/remove',
    isLoggedIn,
    checkAdminRolePermissions,
    removePostController
);

module.exports = router;
