
const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/comparisons/index/get');
const filtersPostController = require('../controllers/comparisons/filters/post');

router.get(
  '/',
  isLoggedIn,
  checkAdminRolePermissions,
  indexGetController
)

router.post(
  '/filters',
  isLoggedIn,
  checkAdminRolePermissions,
  filtersPostController
)

module.exports = router;