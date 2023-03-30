const express = require('express')
const router = express.Router()
const folderController = require('../controllers/folder.controller')
const authJwt = require('../middlewares/authJwt')
const folderMiddleware = require('../middlewares/folder.middlewares')

router.post('/',authJwt.verifyToken, folderMiddleware.checkName, folderController.createFolder)

router.put('/:folderId',authJwt.verifyToken, folderMiddleware.checkName, folderController.updateFolder)

router.delete('/:folderId',authJwt.verifyToken, folderController.deleteFolder)

router.get('/getAllFolder/',authJwt.verifyToken, folderController.getAllFolder)

router.get('/:projectId',authJwt.verifyToken, folderController.getUserFolder)


module.exports = router