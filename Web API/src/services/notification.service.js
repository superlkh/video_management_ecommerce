const db = require('../models')
const Notification = db.notification
const nodeMailer = require('nodemailer')
const User = db.user

const webPush = require('web-push')

const {Op} = require('sequelize')


 
const getNotifications = async(userId, page, search) => {
    if(!page){
        page = 1
    }

    if(!search){
        const result = await Notification.findAndCountAll({
            where: {
                userId: userId
            },
            limit: 10,
            offset: (parseInt(page - 1) * 10),
            order: ['status']
        })
    
        const unreadNotifs = await Notification.findAndCountAll({
            where: {
                userId: userId,
                status: false
            }
        })
        result.unreadCount = unreadNotifs.count
    
        return result
    } else {
        const result = await Notification.findAndCountAll({
            where: {
                userId: userId,
                content: {
                    [Op.substring]: search
                }
            },
            limit: 10,
            offset: (parseInt(page - 1) * 10),
            order: ['status']
        })

        return result
    }
    
}

const addNewNotification = async(senderId, type, subject, content, receiverId) => {
    if(receiverId === []){
        console.log('No users to sent notification')
        return
    }
   
    // payload của web push
    const payload = JSON.stringify({
        title: content
    })
  

    // Database notif
    let result = []
    let emailString = ''
    for (let i = 0; i < receiverId.length; i++){
        const resultTemp = await Notification.create({
            type: type,
            subject: subject,
            createUid: senderId,
            status: false,
            userId: receiverId[i],
            content: content
        })
        result.push(resultTemp)
        const userEmail = await User.findOne({
            where: {
                id: receiverId[i]
            }
        })

        // Gửi thông báo qua push service
          // Vapid details của web push
        webPush.setVapidDetails(
            'http://localhost:3000/',
            userEmail.dataValues.pushSubscription.publicKey,
            userEmail.dataValues.pushSubscription.privateKey
        )
        await webPush.sendNotification(userEmail.dataValues.pushSubscription.subscription, payload).catch(err => console.log(err))

        // Chuỗi email cần gửi
        if(!emailString){
            emailString = userEmail.dataValues.email
        } else {
            emailString = emailString + ', ' + userEmail.dataValues.email
        }
    }
    
    // Email notif
    // Transporter email
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.user,
          pass: process.env.pass
        }
    })

    const mailOptions = {
        from: process.env.user,
        to: emailString,
        subject: 'Notification',
        html: `<h3>${content}</h3>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })

    return result
}

const changeStatus = async(userId, notificationId) => {
    const result = await Notification.update({
        status: true
    },{
        where: {
            id: notificationId,
            userId: userId
        }
    })

    return result
}

module.exports = {
    getNotifications,
    addNewNotification,
    changeStatus,

}