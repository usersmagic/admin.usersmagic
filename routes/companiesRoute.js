const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/companies/index/get');
const editGetController = require('../controllers/companies/edit/get');

const editPostController = require('../controllers/companies/edit/post');

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
  '/edit',
    isLoggedIn,
    checkAdminRolePermissions,
    editPostController
);

module.exports = router;
