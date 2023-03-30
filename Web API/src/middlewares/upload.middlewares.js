const http_status = require('../http_responses/status.response.js')

// Check if the uploaded file(s) exist(s)
checkFileExist = (req, res, next) =>{
    let resObj = {
        status: null,   
        errors: null,
        data: null,
        message: null
    }

    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = 'No files were uploaded.'

            return res.json(resObj)
          }
        if(!req.body.folderId){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = 'Invalid upload'

            return res.json(resObj)
        }

        
    }catch(error){
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err

        return res.json(resObj)
    }

    next()
}

module.exports = {checkFileExist}