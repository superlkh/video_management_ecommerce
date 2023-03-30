const express = require('express')
const router = express.Router()
const video = require('../controllers/video.controllers')
const authJwt = require("../middlewares/authJwt.js");
const videoMiddleware = require('../middlewares/video.middlewares')

// Lấy danh sách video của user trong folder được chỉ định
router.get('/api/video/:username/:folderId', authJwt.verifyToken , video.videoList)
// Stream video
router.get('/api/video/stream/:username/:projectName/:folderName/:videoName', video.getVideo)
// Lấy thumbnail của video
router.get('/api/thumbnail/:userName/:projectName/:folderName/:videoId', video.getThumbnail)
// Thay đổi status của video (thuộc tính publish)
router.put('/api/video/:videoId', [authJwt.verifyToken, videoMiddleware.checkVideoStatus], video.changeVideoStatus)
// Tìm kiếm video
router.post('/api/video', [authJwt.verifyToken, videoMiddleware.checkSearch], video.searchVideo)
// Chuyển video thành file gif và nhận file gif
router.get('/api/gif/:videoId', video.convertToGif)
// Kiểm tra video có chứa nội dung nudity
router.post('/api/video/checkNudity', authJwt.verifyToken, video.checkNudity)
// Lấy bình luận của video
router.get('/api/comments/:videoId', authJwt.verifyToken, video.getComments)
// Lấy bình luận con của một bình luận
router.get('/api/childComment/:videoId', authJwt.verifyToken, video.getChildComments)
// Bình luận video
router.post('/api/comments/:videoId', [authJwt.verifyToken, videoMiddleware.checkComment], video.commentVideo)
// Sửa bình luận
router.put('/api/comments/:commentId', [authJwt.verifyToken], video.updateComment)
// Xóa bình luận
router.delete('/api/comments/:commentId', authJwt.verifyToken, video.deleteComment)
// Xóa video
router.post('/video/deleteVideo', authJwt.verifyToken, video.softDeleteVideo)
// Xóa background video
router.post('/video/removeBackground', authJwt.verifyToken, video.removeBackground)
// Đổi màu background
router.post('/video/changeBgColor', authJwt.verifyToken, video.changeBgColor)
// Đổi ảnh background
router.post('/video/changeBgImg', authJwt.verifyToken, video.changeBgImg)
// Xử lý tag cho video
router.post('/video/tag/autoTagging', authJwt.verifyToken, video.autoTagging)
router.get('/video/tag/:videoId', authJwt.verifyToken, video.getTagVideo)
router.delete('/video/tag/:videoId', authJwt.verifyToken, video.deleteTag)
router.post('/video/tag/:videoId', authJwt.verifyToken, video.addTagManual)


module.exports = router