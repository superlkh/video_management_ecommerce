const connectService = require('../services/connect.service')
const http_status = require('../http_responses/status.response.js')

const getGoogleUrl = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const url = await connectService.getGoogleUrl()
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = {
            url
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    res.json(resObj)
}

const decodeToken = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await connectService.decodeToken(req.body.code, req.userId)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    res.json(resObj)
}

const logoutGoogleAccount = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // return so luong row xoa thanh cong
        const result = await connectService.logoutGoogleAccount(req.userId)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_REQUEST_DENIED
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    res.json(resObj)
}

module.exports = {
    getGoogleUrl,
    decodeToken,
    logoutGoogleAccount
}