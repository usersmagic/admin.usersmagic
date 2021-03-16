const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/submitions/index/get');
const approveGetController = require('../controllers/submitions/approve/get');

const rejectPostController = require('../controllers/submitions/reject/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);
router.get(
  '/approve',
    isLoggedIn,
    checkAdminRolePermissions,
    approveGetController
);

router.post(
  '/reject',
    isLoggedIn,
    checkAdminRolePermissions,
    rejectPostController
);

module.exports = router;
