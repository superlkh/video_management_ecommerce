const express = require('express')
const router = express.Router()
const authJwt = require('../middlewares/authJwt')
const designController = require('../controllers/designs.controller')

router.post('/api/designs', designController.createNewDesign)

router.get('/api/designs/:designId', designController.getDesign)

router.patch('/api/designs/:designId', designController.updateDesign)
module.exports = router