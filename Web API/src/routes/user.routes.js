const express = require('express')
const router = express.Router()
const authJwt = require("../middlewares/authJwt.js");
const userController = require("../controllers/user.controller.js");
const passport = require("passport");


router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/api/test/all", userController.allAccess);

router.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);

router.get("/api/test/mod", [authJwt.verifyToken], userController.moderatorBoard);

router.get("/api/test/admin", [authJwt.verifyToken], userController.adminBoard);
// Tìm kiếm user
router.post('/api/user', [authJwt.verifyToken], userController.searchUsers)
// Lấy tất cả user info
router.get('/api/all-user', [authJwt.verifyToken], userController.getUsersInfo)
// Lấy thông tin của 1 user
router.get('/api/user', authJwt.verifyToken, userController.getOneUser)
// User DashBoard
router.get('/api/user/dashboard', authJwt.verifyToken, userController.userDashBoard)
// Get all memory user is using
router.get('/user/updateUserStorage', [authJwt.verifyToken], userController.updateUserStorage)
// Post change password
router.post('/user/changePassword', [authJwt.verifyToken], userController.changePassword)
// Connect to cloudinary
router.post('/user/connectCloudinary', [authJwt.verifyToken], userController.connectCloudinary)
// connect google account
router.post('/user/connectGoogleAccount', [authJwt.verifyToken], userController.connectGoogleAccount)
// check if user login google account
router.get('/user/google/status', [authJwt.verifyToken], userController.checkLoginGoogle)
// Sửa cột deleted của user
router.put('/api/user', authJwt.verifyToken, userController.changeDeleteStatus)
module.exports = router


