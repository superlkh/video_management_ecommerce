const express = require('express')
const router = express.Router()
const checkUpload = require('../middlewares/upload.middlewares.js')
const authJwt = require("../middlewares/authJwt.js");
const upload = require('../controllers/upload.controllers.js')


router.post('/api/upload/', [authJwt.verifyToken, checkUpload.checkFileExist], upload.uploadFile)
router.post('/api/uploadImages', [authJwt.verifyToken], upload.uploadImages)
router.post('/api/uploadImageFromUrl', [authJwt.verifyToken], upload.uploadImageFromUrl)


module.exports = router