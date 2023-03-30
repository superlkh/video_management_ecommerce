// Authorize Key

require('dotenv').config()

module.exports = {
    secret: process.env.secret,
    userGmail: process.env.user,
    passGmail: process.env.pass
}