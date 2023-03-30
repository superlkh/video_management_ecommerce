// Verify Signup

const db = require('../models')
const ROLES = db.ROLES
const User = db.user
const http_status = require('../http_responses/status.response.js')

// Check if username or email is duplicate or not
checkValidSignUpRequest = (req, res, next) =>{
    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try{
        console.log(req.body)
        if(!req.body.username || !req.body.email || !req.body.password){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = "You didn't type all the neccessary information to sign up"
    
            return res.json(resObj)
        }
    }catch(error){
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        return res.json(resObj)
    }
    
    next()
}

// Check if roles in the request is existed or not
checkRolesExisted = (req, res, next) => {
    
    if (req.body.roles) {   
        for (let i = 0; i < req.body.roles.length; i++) {
          if (!ROLES.includes(req.body.roles[i])) {
            res.status(400).send({
              message: "Failed! Role does not exist = " + req.body.roles[i]
            });
            return;
          }
        }
    }

    next()
}

const verifySignup = {
    checkValidSignUpRequest: checkValidSignUpRequest,
    checkRolesExisted: checkRolesExisted
}

module.exports = verifySignup


