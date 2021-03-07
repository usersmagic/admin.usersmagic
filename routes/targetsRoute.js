const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/targets/index/get');

const approvePostController = require('../controllers/targets/approve/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);

router.post(
  '/approve',
    isLoggedIn,
    checkAdminRolePermissions,
    approvePostController
);

module.exports = router;
