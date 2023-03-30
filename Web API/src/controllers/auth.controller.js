// User's Authentication

const signUpService = require('../services/signup.service.js')
const signinService = require('../services/signin.service.js')
const forgotPasswordService = require('../services/forgotPassword.service')
const http_status = require('../http_responses/status.response.js')

//Sign up
signup = async (req, res) => {
    const userDetails = req.body

    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try {

        let user = await signUpService.createUser(userDetails)
        if (user) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = user
            resObj.message = "User's registration is successful"
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = "username or email is already used!"
        }

    } catch (err) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err
    }

    res.json(resObj)
}

// Sign in
signin = async (req, res) => {

    const userDetails = req.body

    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try {
        let user = await signinService.grantToken(userDetails)

        if (user) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = user
            resObj.message = "Sign in successfully"
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = "Wrong username or password"
        }

    } catch (err) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err
    }

    res.json(resObj)
}

const checkUserNameExist = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        const isExist = await forgotPasswordService.checkUserNameExist(req.query.userName)
        resObj.data = {
            isExist
        }
    } catch (err) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err
    }
    res.json(resObj)
}

const sendOtp = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        await forgotPasswordService.sendOtp(req.query.userName)
    } catch (err) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err
    }
    res.json(resObj)
}

const confirmOtp = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        const result = await forgotPasswordService.confirmOtp(req.query.otp, req.query.userName)
        resObj.data = {
            message: result
        }
    } catch (err) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err
    }
    res.json(resObj)
}

const changePassword = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        const result = await forgotPasswordService.changePassword(req.body.userName, req.body.password)
        resObj.data = {
            message: result
        }
    } catch (err) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err
    }
    res.json(resObj)
}

module.exports = {
    signup,
    signin,
    checkUserNameExist,
    sendOtp,
    confirmOtp,
    changePassword
}