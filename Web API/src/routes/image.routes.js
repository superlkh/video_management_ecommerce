const express = require('express')
const router = express.Router()
const imgController = require('../controllers/image.controller')
const authJwt = require('../middlewares/authJwt')

router.get('/:folderId', authJwt.verifyToken, imgController.getImageList)
router.get('/api/img/show/:userName/:projectName/:folderName/:imgName', imgController.getImage)
router.post('/createVideoFromImages',authJwt.verifyToken, imgController.createVideoFromImages)
router.post('/removebg',authJwt.verifyToken, imgController.removeBg)
router.post('/deleteImg',authJwt.verifyToken, imgController.deleteImg)
router.post('/changeBgColor',authJwt.verifyToken, imgController.changeBgColor)
router.post('/changeBgImg',authJwt.verifyToken, imgController.changeBgImg)
router.get('/tag/:imageId',authJwt.verifyToken, imgController.getTagImage)
router.post('/tag/autoTagging',authJwt.verifyToken, imgController.autoTagging)
router.delete('/tag/:imageId',authJwt.verifyToken, imgController.deleteTag)
router.post('/tag/:imageId',authJwt.verifyToken, imgController.addTagManual)
router.post('/checkNudity',authJwt.verifyToken, imgController.checkNudity)
router.post('/uploadCloudinary',authJwt.verifyToken, imgController.uploadCloudinary)
router.post('/uploadGoogleDrive',authJwt.verifyToken, imgController.uploadGoogleDrive)
router.post('/downloadGoogleDrive',authJwt.verifyToken, imgController.downloadGoogleDrive)


module.exports = router