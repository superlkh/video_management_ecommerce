const { HTTP_RESPONE_STATUS_UNKNOWN_ERROR } = require('../http_responses/status.response.js')
const http_status = require('../http_responses/status.response.js')

// Kiểm tra tính hợp lệ của tên project
const checkProjectName = (req, res, next) =>{
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Nếu request không cung cấp tên project
        if(!req.body.projectName){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'Project name is not provided'
            return res.json(resObj)
        }
        
        // Các ký tự không hợp lệ trong tên project
        const invalidChar = ['/', '<', '>', '|', '?', '*', ':', '"']
        // Nếu request cung cấp tên project bao gồm các ký tự không hợp lệ
        for (let i = 0; i < invalidChar.length; i++){
            if(req.body.projectName.includes(invalidChar[i])){
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = `Project name cannot include ${invalidChar[i]}`
                return res.json(resObj)
            }
        }
       
    } catch (error) {
        // Bắt lỗi
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }

    next()
}

// Kiểm tra câu xác nhận xóa project
const checkDelete = (req, res, next) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Nếu request không cung cấp câu xác nhận xóa project
        if(!req.body.deleteSentence){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'Delete sentence is not provided'
            return res.json(resObj) 
        } else if (req.body.deleteSentence !== 'Delete'){
            // Nếu câu xác nhận xóa project sai nội dung
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'Wrong delete senctence'
            return res.json(resObj) 
        }
    } catch (error) {
        // Bắt lỗi
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
        if(!req.query.projectName){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'No project name provided'
            return res.json(resObj)
        }
        if(!req.query.page){
            req.query.page = 1
        }
    } catch (error) {
        res.status = HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }

    next()
}

const checkAddUserProject = async(req, res, next) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        if(!req.body.username || !req.body.projectId){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = "No user or project provided"
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
    checkProjectName,
    checkDelete, 
    checkSearch,
    checkAddUserProject
}