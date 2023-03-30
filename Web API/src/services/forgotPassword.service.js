const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt')
const { authenticator } = require('otplib')

const auth_config = require('../config/auth.config')
const db = require('../models')

const User = db.user
const Otp = db.otp

const checkUserNameExist = (userName) => {
    return User.findOne({ where: { username: userName } }).then(result => {
        if (result === null)
            return false
        return true
    })
}

const sendOtp = async (userName) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: auth_config.userGmail,
            pass: auth_config.passGmail
        }
    })

    const user = await User.findOne({
        attributes: ['email'],
        where: { username: userName }
    })
    const email = user.dataValues.email
    const secret = authenticator.generateSecret()
    const otp = authenticator.generate(secret)

    const mailOptions = {
        from: auth_config.user,
        to: email,
        subject: 'Send OTP to change password',
        text: otp
    }

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log(error)
        } else {
            const userFinding = await User.findOne({ where: { username: userName } })
            const userId = userFinding.dataValues.id
            const OtpObject = {
                userId,
                secret,
                otp,
                expireTime: new Date(+new Date() + 20000)
            }
            await Otp.create(OtpObject)
        }

    })

}

// return 1: otp expire, 2: otp invalid, 3: otp valid
const confirmOtp = async (otp, userName) => {
    try {
        const userFinding = await User.findOne({ where: { username: userName } })
        const userId = userFinding.dataValues.id
        const otpFinding = await Otp.findAll({
            where: {
                userId,
            },
            order: [
                ['id', 'DESC'],
            ],
            limit: 1
        })
        console.log(otpFinding[0].secret)
        if (otpFinding[0].expireTime < new Date()) {
            return 1
        }
        if (!authenticator.verify({ token: otp, secret: otpFinding[0].secret })) {
            return 2
        }
        if (authenticator.verify({ token: otp, secret: otpFinding[0].secret })) {
            return 3
        }
    } catch (err) {
        console.log(err)
    }
}

const changePassword = (userName, password) => {
    return User.update({ password: bcrypt.hashSync(password, 8) }, { where: { username: userName } })
}

module.exports = {
    checkUserNameExist,
    sendOtp,
    confirmOtp,
    changePassword
}