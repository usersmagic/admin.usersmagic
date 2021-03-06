const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/countries/index/get');

const createPostController = require('../controllers/countries/create/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);

router.post(
  '/create',
    isLoggedIn,
    checkAdminRolePermissions,
    createPostController
);

module.exports = router;
