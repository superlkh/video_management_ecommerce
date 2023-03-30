const express = require('express')
const router = express.Router()
const verifySignUp = require("../middlewares/verifySignUp.js");
const routeController = require("../controllers/auth.controller.js");

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers",
  "x-access-token, Origin, Content-Type, Accept")
  res.header(
    "Access-Control-Allow-Origin", "http://localhost:3000" 
  )
  next()
})


router.post("/api/auth/signup", [verifySignUp.checkValidSignUpRequest, verifySignUp.checkRolesExisted], routeController.signup)

router.post("/api/auth/signin", routeController.signin)

router.get("/api/auth/checkUserName", routeController.checkUserNameExist)

router.get("/api/auth/sendOtp", routeController.sendOtp)

router.get("/api/auth/confirmOtp", routeController.confirmOtp)

router.post("/api/auth/changePassword", routeController.changePassword)



module.exports = router


