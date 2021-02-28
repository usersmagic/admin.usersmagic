const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/campaigns/index/get');
const questionsGetController = require('../controllers/campaigns/questions/get');
const startGetController = require('../controllers/campaigns/start/get');
const stopGetController = require('../controllers/campaigns/stop/get');

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
router.get(
  '/start',
    isLoggedIn,
    checkAdminRolePermissions,
    startGetController
);
router.get(
  '/stop',
    isLoggedIn,
    checkAdminRolePermissions,
    stopGetController
);

router.post(
  '/create',
    isLoggedIn,
    checkAdminRolePermissions,
    createPostController
);

module.exports = router;
