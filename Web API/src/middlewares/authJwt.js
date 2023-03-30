// User's authorization

const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const http_status = require('../http_responses/status.response.js')

// Verify token
verifyToken = async (req, res, next) => {
    
    let resObj = {
        status: null,
        errors: null,
        data: null,
        message: null
    }

    try{
        let token = req.headers["x-access-token"];
  
        if (!token) {
          resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
          resObj.message = "No token provided"

          return res.json(resObj)
        }
      
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.message = "Unauthorized"

            return res.json(resObj)
          }
          
          req.userId = decoded.id
          req.userName = decoded.username
          
        })
    } catch(err){
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = err

        return res.json(resObj)
    }

    next()
}

const authJwt = {
    verifyToken: verifyToken,
}

module.exports = authJwt