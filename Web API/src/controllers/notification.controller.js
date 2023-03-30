const http_status = require('../http_responses/status.response.js')
const notificationService = require('../services/notification.service')


// create a function to subscribe to topics

// add the function to the list of subscribers for a particular topic
// we're keeping the returned token, in order to be able to unsubscribe
// from the topic later on



// Lấy thông báo
const getNotifications = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }   

    try {
        const result = await notificationService.getNotifications(req.userId, req.query.page, req.query.search)
        resObj.data = result
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

// Thêm thông báo mới
const addNewNotification = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }
   
    // try {
        const result = await notificationService.addNewNotification(req.userId, req.body.type, req.body.subject, req.body.content, req.body.receiverId)
        resObj.data = result
    // } catch (error) {
    //     resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
    //     resObj.errors = error
    // }

    return res.json(resObj)
}
// Thay đổi status = đã đọc thông báo
const changeStatus = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await notificationService.changeStatus(req.userId, req.params.notificationId)
        if(result[0] === 0){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

module.exports = {
    getNotifications,
    addNewNotification,
    changeStatus,

}