const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/questions/index/get');
const editGetController = require('../controllers/questions/edit/get');

const createPostController = require('../controllers/questions/create/post');
const editPostController = require('../controllers/questions/edit/post');

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
  '/create',
    isLoggedIn,
    checkAdminRolePermissions,
    createPostController
);
router.post(
  '/edit',
    isLoggedIn,
    checkAdminRolePermissions,
    editPostController
);

module.exports = router;
