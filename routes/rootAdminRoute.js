const express = require('express');
const router = express.Router();

const isRootAdmin = require('../middleware/isRootAdmin');

const indexGetController = require('../controllers/root_admin/index/get');
const loginGetController = require('../controllers/root_admin/login/get');
const adminsDeleteGetController = require('../controllers/root_admin/admins/delete/get');
const adminsFindGetController = require('../controllers/root_admin/admins/find/get');
const adminsIndexGetController = require('../controllers/root_admin/admins/index/get');

const loginPostController = require('../controllers/root_admin/login/post');
const adminsCreatePostController = require('../controllers/root_admin/admins/create/post');

router.get(
  '/',
    isRootAdmin,
    indexGetController
);
router.get(
  '/login',
    loginGetController
);
router.get(
  '/admins',
    isRootAdmin,
    adminsIndexGetController
);
router.get(
  '/admins/delete',
    isRootAdmin,
    adminsDeleteGetController
);
router.get(
  '/admins/find',
    isRootAdmin,
    adminsFindGetController
);

router.post(
  '/login',
    loginPostController
);
router.post(
  '/admins/create',
    isRootAdmin,
    adminsCreatePostController
);

module.exports = router;
