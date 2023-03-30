const express = require('express')
const router = express.Router()
// Middleware kiểm tra token
const authJwt = require("../middlewares/authJwt.js")
// Middleware của project
const projectMiddleware = require('../middlewares/project.middlewares.js')
// Controller của project
const projectController = require('../controllers/project.controller.js')

// Lấy tất cả project thuộc về bản thân user
router.get('/api/project', authJwt.verifyToken, projectController.getProjects)
// Lấy một project chỉ định của bản thân user
router.get('/api/project/:projectId', authJwt.verifyToken, projectController.getOneProject)
// Lấy project mà user tham gia
router.get('/api/project/working/invite', authJwt.verifyToken, projectController.getWorkingProjects)
// Tạo một project thuộc về bản thân user
router.post('/api/project', [authJwt.verifyToken, projectMiddleware.checkProjectName], projectController.createProject)
// Thay đổi tên của một project thuộc về user
router.put('/api/project/:projectId', [authJwt.verifyToken, projectMiddleware.checkProjectName], projectController.changeProjectName)
// Xóa một project chưa có CASCADE
router.delete('/api/project/:projectId', [authJwt.verifyToken, projectMiddleware.checkDelete], projectController.deleteProject)
// Tìm project theo tên
router.post('/api/project/search', [authJwt.verifyToken, projectMiddleware.checkSearch], projectController.searchProject)
// Thêm user tham gia vào project
router.post('/api/project/addUser', [authJwt.verifyToken, projectMiddleware.checkAddUserProject], projectController.addUserProject)
// Lấy tất cả user id tham gia project
router.get('/api/project/:projectId/users', authJwt.verifyToken, projectController.findAllUsers)

module.exports = router