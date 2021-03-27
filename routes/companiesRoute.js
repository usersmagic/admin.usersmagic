const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/companies/index/get');

const resetPostController = require('../controllers/companies/reset/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);

router.post(
  '/reset',
    isLoggedIn,
    checkAdminRolePermissions,
    resetPostController
);

module.exports = router;
