
const express = require("express");
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const checkAdminRolePermissions = require('../middleware/checkAdminRolePermissions');

const indexGetController = require("../controllers/case_studies/index/get");
const createPostController = require("../controllers/case_studies/create/post");
const editPostController = require("../controllers/case_studies/edit/post");
const deletePostController = require("../controllers/case_studies/delete/post");
const getAllGetController = require("../controllers/case_studies/getAll/get");
const getSingleGetController = require("../controllers/case_studies/getSingle/get");
const updateGetController = require("../controllers/case_studies/update/get");

// Case Studies admin index route
router.get(
    "/",
    isLoggedIn,
    checkAdminRolePermissions,
    indexGetController
)

router.get(
    "/getAll",
    isLoggedIn,
    checkAdminRolePermissions,
    getAllGetController
)

router.get(
    "/update",
    isLoggedIn,
    checkAdminRolePermissions,
    updateGetController
)

router.post(
    "/getSingle",
    isLoggedIn,
    checkAdminRolePermissions,
    getSingleGetController
)


router.post(
    "/create",
    isLoggedIn,
    checkAdminRolePermissions,
    createPostController
)

router.post(
    "/edit",
    isLoggedIn,
    checkAdminRolePermissions,
    editPostController
)

router.post(
    "/delete",
    isLoggedIn,
    checkAdminRolePermissions,
    deletePostController
)

module.exports = router;