//User controller

const userAuthorize = require('../services/user.service.js')
const http_status = require('../http_responses/status.response.js')
const { HTTP_RESPONE_STATUS_UNKNOWN_ERROR } = require('../http_responses/status.response.js')

allAccess = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try {
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = 'Public Content'
        resObj.message = 'Get data successfully'

    } catch (error) {
        resObj.status = HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

userBoard = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try {
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = 'User Content'
        resObj.message = 'Get data successfully'

    } catch (error) {
        resObj.status = HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

adminBoard = async (req, res) => {

    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try {
        let admin = await userAuthorize.isAdmin(req.userId)
        if (admin) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = 'Admin content'
            resObj.message = 'Get data succesfully'
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = 'Require Admin Role'
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

moderatorBoard = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }
    try {
        const moderator = await userAuthorize.isModerator(req.userId)
        if (moderator) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = 'Moderator content'
            resObj.message = 'Get data succesfully'
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = 'Require Moderator Role'
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const searchUsers = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const users = await userAuthorize.searchUsers(req.userId, req.query.username, req.query.projectId, req.query.page)
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = users
        return res.json(resObj)
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

const getUsersInfo = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await userAuthorize.getUsersInfo(req.userId, req.query.page, req.query.search)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.data = result
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}


const getOneUser = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await userAuthorize.getOneUser(req.userId)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.data = result
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}


const userDashBoard = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await userAuthorize.userDashBoard(req.userId)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const updateUserStorage = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await userAuthorize.updateUserStorage()
        resObj.data = result
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}


const changePassword = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }
    try {
        const result = await userAuthorize.changeDeleteStatus(req.userId, req.body.userId, req.body.deleteStatus)
        if (result[0] === 0) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const changeDeleteStatus = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await userAuthorize.changeDeleteStatus(req.userId, req.body.userId, req.body.deleteStatus)
        if (result[0] === 0) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const connectCloudinary = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        // return 1: tai khoan hop le, -1: tai khoan ko hop le, 0: co loi trong qua trinh xu ly
        const result = await userAuthorize.connectCloudinary(req.userId, req.body)

        if (result === 0) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        } else if (result === 1) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        } else if (result === -1) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const connectGoogleAccount = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        // return về name, email, picture cua account
        const result = await userAuthorize.connectGoogleAccount(req.body.accountInfo, req.userId)
        resObj.data = result
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    res.json(resObj)
}

const checkLoginGoogle = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        // neu co login thi return ve name, email, picture cua account, ko login return false
        const result = await userAuthorize.checkLoginGoogle(req.userId)
        if (result) {
            resObj.data = {
                isLogin: true,
                result
            }
        } else {
            resObj.data = {
                isLogin: false
            }
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    res.json(resObj)
}



module.exports = {
    allAccess,
    userBoard,
    adminBoard,
    moderatorBoard,
    searchUsers,
    getUsersInfo,
    getOneUser,
    userDashBoard,
    updateUserStorage,
    changePassword,
    changeDeleteStatus,
    connectCloudinary,
    connectGoogleAccount,
    checkLoginGoogle
}