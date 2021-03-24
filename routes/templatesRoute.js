const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require('../controllers/templates/index/get');
const editFinishGetController = require('../controllers/templates/edit/finish/get');
const editIndexGetController = require('../controllers/templates/edit/index/get');
const orderGetController = require('../controllers/templates/order/get');
const startGetController = require('../controllers/templates/start/get');
const stopGetController = require('../controllers/templates/stop/get');

const createPostController = require('../controllers/templates/create/post');
const editSavePostController = require('../controllers/templates/edit/save/post');

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
    editIndexGetController
);
router.get(
  '/edit/finish',
    isLoggedIn,
    checkAdminRolePermissions,
    editFinishGetController
);
router.get(
  '/order',
    isLoggedIn,
    checkAdminRolePermissions,
    orderGetController
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
router.post(
  '/edit/save',
    isLoggedIn,
    checkAdminRolePermissions,
    editSavePostController
);

module.exports = router;
