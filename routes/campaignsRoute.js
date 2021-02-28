const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/campaigns/index/get');
const questionsGetController = require('../controllers/campaigns/questions/get');

const createPostController = require('../controllers/campaigns/create/post');

router.get(
  '/',
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
);
router.get(
  '/questions',
    isLoggedIn,
    checkAdminRolePermissions,
    questionsGetController
);

router.post(
  '/create',
    isLoggedIn,
    checkAdminRolePermissions,
    createPostController
);

module.exports = router;
