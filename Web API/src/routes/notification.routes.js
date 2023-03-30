const express = require('express')
const router = express.Router()

// Middleware kiểm tra token
const authJwt = require("../middlewares/authJwt.js")
// Thông báo controller
const notificationController = require('../controllers/notification.controller')

// Lấy thông báo
router.get('/api/notifications', authJwt.verifyToken, notificationController.getNotifications)
// Thêm thông báo mới
router.post('/api/notifications', authJwt.verifyToken, notificationController.addNewNotification)
// Thay đổi status = đã đọc thông báo
router.put('/api/notifications/:notificationId', authJwt.verifyToken, notificationController.changeStatus)

module.exports = router