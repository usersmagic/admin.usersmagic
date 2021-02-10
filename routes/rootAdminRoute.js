const express = require('express');
const router = express.Router();

const isRootAdmin = require('../middleware/isRootAdmin');

const indexGetController = require('../controllers/root_admin/index/get');
const loginGetController = require('../controllers/root_admin/login/get');

const loginPostController = require('../controllers/root_admin/login/post');

router.get(
  '/',
    isRootAdmin,
    indexGetController
);
router.get(
  '/login',
    loginGetController
);

router.post(
  '/login',
    loginPostController
);

module.exports = router;
