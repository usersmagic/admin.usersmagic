const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/companies/index/get');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);

module.exports = router;
