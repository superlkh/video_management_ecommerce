const http_status = require('../http_responses/status.response.js')
const uploadService = require('../services/upload.services.js')
const storage = require('../config/storage.config.js')

const uploadFile = (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }
    try {
        const video = uploadService.saveFileToDB(req)

        video.then(value => {
            if (!value) {
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                return res.json(resObj)
            } else {
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
                resObj.data = value.dataValues
                resObj.message = 'File Uploaded!'
                return res.json(resObj)
            }

        })
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

const uploadImages = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        await uploadService.saveImageToDB(req)
    } catch (error) {
        resObj.errors = error
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.data = {
            message: error.message
        }
    }

    return res.json(resObj)
}

const uploadImageFromUrl = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        await uploadService.uploadImageFromUrl(req.body.url, req.body.folderId, req.userName)
    } catch (error) {
        resObj.errors = error
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        
        console.log(error.message)
    }

    return res.json(resObj)
}

module.exports = {
    uploadFile,
    uploadImages,
    uploadImageFromUrl
}