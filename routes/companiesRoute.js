const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/companies/index/get');
const editGetController = require('../controllers/companies/edit/get');

const updatePostController = require('../controllers/companies/update/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);

router.get(
  '/edit',
    isLoggedIn,
    checkAdminRolePermissions,
    editGetController
);

router.post(
  '/update',
    isLoggedIn,
    checkAdminRolePermissions,
    updatePostController
);

module.exports = router;
