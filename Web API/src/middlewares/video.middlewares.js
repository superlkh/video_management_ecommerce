
const http_status = require('../http_responses/status.response.js')

const checkVideoStatus = async (req, res, next) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    
    try {
        if(!req.params.videoId || !req.body.projectId || !req.body.folderId || (req.body.status !== 0 && !req.body.status)){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = "No status, video id, project id or folder id provided!"
            return res.json(resObj)
        }  
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }

    next()
}

const checkSearch = async (req, res, next) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    
    try {
        if(!req.body.projectId || !req.body.folderId){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = "No project id or folder id provided!"
            return res.json(resObj)
        }  
        if(!req.query.videoName){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = "No video name provided"
            return res.json(resObj)
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        return resObj
    }
    
    next()
}

const checkComment = async(req, res, next) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    try {
        if(!req.params.videoId){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'No video ID provided'
            return res.json(resObj)
        }
        
        if(!req.body.comment || !req.body.projectId ||!req.body.folderId){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'Invalid comment'
            return res.json(resObj)
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }

    next()
}

module.exports = {
    checkVideoStatus, 
    checkSearch,
    checkComment
}