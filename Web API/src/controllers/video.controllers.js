// const http_status = require('../http_responses/status.response.js')
const fs = require('fs')
const storage = require('../config/storage.config')
const video = require('../services/video.service.js')
const http_status = require('../http_responses/status.response.js')
const { HTTP_RESPONE_STATUS_INVALID_REQUEST } = require('../http_responses/status.response.js')

const videoList = (req, res) => {

    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    if (req.userName !== req.params.username) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        resObj.errors = "Not allowed to access"
        return res.json(resObj)
    }

    try {
        const listOfVideo = video.getUserVideos(req.params.folderId, req.query.page)
        listOfVideo.then(videos => {
            if (videos) {
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
                resObj.data = videos
                return res.json(resObj)
            } else {

                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                return res.json(resObj)
            }
        })

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }


}

const convertToGif = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await video.convertToGif(req.params.videoId)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            return res.json(resObj)
        } else {
            setTimeout(() => {
                res.sendFile(result)
            }, 300)

        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

const getVideo = (req, res) => {

    const path = `${storage.storage}/${req.params.username}/${req.params.projectName}/${req.params.folderName}/${req.params.videoName}`
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);

    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
}

const getThumbnail = (req, res) => {

    const getThumbnail = video.getThumbnail(req.params.userName, req.params.projectName, req.params.folderName, req.params.videoId)
    getThumbnail.then(value => {
        if (!value) {
            res.send('Null')
        }
        res.sendFile(`${storage.storage}/${value}`)
    })

}

const changeVideoStatus = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const statusResult = video.changeVideoStatus(req)
        statusResult.then(value => {
            if (!value) {
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = "Video not found"
            } else if (value[0] === 0) {
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = "Failed to update video status"
            } else {
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            }

            return res.json(resObj)
        })
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

const searchVideo = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await video.searchVideo(req)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = "No result found"
            return res.json(resObj)
        }

        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = result
        return res.json(resObj)

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

const getComments = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await video.getComments(req.userId, req.params.videoId, req.query.page)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const getChildComments = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await video.getChildComments(req.userId, req.params.videoId, req.query.commentId)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const commentVideo = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    console.log(req.body)
    try {
        const result = await video.commentVideo(req.userId, req.params.videoId, req.body)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const updateComment = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await video.updateComment(req.userId, req.params.commentId, req.body.newComment)
        console.log(result)
        if (result[0] === 0) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const deleteComment = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    try {
        const result = await video.deleteComment(req.userId, req.params.commentId)
        if (result === 0) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const checkNudity = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }
    try {
        const isNudity = await video.checkNudity(req)

        if (isNudity) {
            resObj.data = {
                isNudity: 1
            }
        } else {
            resObj.data = {
                isNudity: -1
            }
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        console.log('Có lỗi')
        console.log('error:', error)
        resObj.errors = error
    }
    return res.json(resObj)
}

const getTagVideo = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR,
        errors: null,
        data: null
    }
    try {
        // return list tags
        const tags = await video.getTagVideo(req.params.videoId)
        if (tags) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                tags
            }
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                tags: []
            }
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const deleteTag = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR,
        errors: null,
        data: null
    }
    try {
        // return số dòng update sau khi delete tag
        const result = await video.deleteTag(req.params.videoId, req.body.tagName)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const addTagManual = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR,
        errors: null,
        data: null
    }
    try {
        // return số dòng update sau khi add tag
        const result = await video.addTagManual(req.params.videoId, req.body.tagName)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const autoTagging = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        // return danh sách tags
        const tags = await video.autoTagging(req)
        console.log('tags: ', tags)
        resObj.data = {
            tags
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const softDeleteVideo = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {

        const result = await video.softDeleteVideo(req.body.id)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const removeBackground = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return số dòng update khi thay đổi size của video
        const result = await video.removeBackground(req.body.path, req.userName)
        console.log('result la: ', result)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const changeBgColor = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return số dòng update size của ảnh sau khi change bg
        const isSuccess = await video.changeBgColor(req.body.path, req.body.color)
        console.log('So dong update size: ', isSuccess)
        if (isSuccess) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                message: 'Change background successfully'
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)

}

const changeBgImg = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return số dòng update size của ảnh sau khi change bg
        const isSuccess = await video.changeBgImg(req)
        if (isSuccess) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                message: 'Change background successfully'
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)
}

module.exports = {
    getVideo,
    videoList,
    getThumbnail,
    changeVideoStatus,
    searchVideo,
    getComments,
    getChildComments,
    commentVideo,
    updateComment,
    deleteComment,
    convertToGif,
    checkNudity,
    getTagVideo,
    deleteTag,
    addTagManual,
    autoTagging,
    softDeleteVideo,
    removeBackground,
    changeBgColor,
    changeBgImg
}