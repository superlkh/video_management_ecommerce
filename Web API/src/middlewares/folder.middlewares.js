const http_status = require('../http_responses/status.response.js')

const checkName = (req, res, next) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Nếu request không cung cấp tên project
        if (!req.body.folderName) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'Folder name is not provided'
            return res.json(resObj)
        }

        // Các ký tự không hợp lệ trong tên project
        const invalidChar = ['/', '<', '>', '|', '?', '*', ':', '"']
        // Nếu request cung cấp tên project bao gồm các ký tự không hợp lệ
        for (let i = 0; i < invalidChar.length; i++) {
            if (req.body.folderName.includes(invalidChar[i])) {
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = `Folder name cannot include ${invalidChar[i]}`
                return res.json(resObj)
            }
        }

    } catch (error) {
        // Bắt lỗi
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error.message
        return res.json(resObj)
    }

    next()
}

module.exports = {
    checkName
}