const express = require('express')
const router = express.Router()
const authJwt = require("../middlewares/authJwt.js")
const connectController = require('../controllers/connect.controller')


// lay url de mo user consent screen
router.get('/connect/google/getUrl', authJwt.verifyToken, connectController.getGoogleUrl)
// post code de decode ra token
router.post('/connect/google/decodeToken', authJwt.verifyToken, connectController.decodeToken)
// logout google account
router.post('/connect/google/logout', [authJwt.verifyToken], connectController.logoutGoogleAccount)

module.exports = router