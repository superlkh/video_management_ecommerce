import axios from 'axios'
import api from '../config/api.config'
import subscription from '../config/webPush.config'

const getNotifications = async(page, keyWord) => {
    
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/notifications`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        params: {
            page: page,
            search: keyWord
        }
    })
    
    return res
}

const addNewNotification = async(info) => {

    const res = await axios({
        method: 'post',
        url: `${api.url}/api/notifications`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        data: {
            type: info.type,
            subject: info.subject,
            content: info.content,
            receiverId: info.receiverId
        }
    })

    return res
   
}

const changeStatus = async(notifId) => {

    const res = await axios({
        method: 'put',
        url: `${api.url}/api/notifications/${notifId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
    })

    return res
}

const notificationService = {
    getNotifications,
    addNewNotification,
    changeStatus,
}

export default notificationService