import axios from 'axios'
import api from 'src/config/api.config'
import { saveAs } from 'file-saver'
import projectService from './project.service'
import notificationService from './notification.service'
import notifConfig from '../config/notification.config'

const API_URL = process.env.REACT_APP_API_URL
const token = localStorage.getItem('X-Auth-Token')

const changeVideoStatus = async (info) => {

    const changeStatusRequest = {
        projectId: info.projectId,
        folderId: info.folderId,
        status: info.videoStatus
    }

    const res = await axios.put(`${api.url}/api/video/${info.videoId}`, changeStatusRequest, {
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    if (res.data.status === 'OK') {
        const resUsers = await projectService.findAllUserId(info.projectId)

        if (resUsers.data.status === 'OK' && resUsers.data.data.users.length > 0) {
            const resNotif = await notificationService.addNewNotification({
                type: notifConfig.notifType.update,
                subject: notifConfig.notifSubject.video,
                content: `${localStorage.getItem('Username')} has PUBLISHED/UNPUBLISHED a video in project ${resUsers.data.data.projectName} `,
                receiverId: resUsers.data.data.users
            })
            if (resNotif.data.status !== 'OK') {
                alert('Failed to notify')
            }
        }
    }

    return res
}

const searchVideo = async (info) => {
    const res = axios({
        method: 'post',
        url: `${api.url}/api/video`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        data: {
            projectId: info.projectId,
            folderId: info.folderId,
        },
        params: {
            videoName: info.videoName,
            page: info.page,
            type: info.type
        }
    })

    return res
}

const convertToGif = async (videoId, videoName) => {
    const gifName = videoName.replace('mp4', 'gif')
    saveAs(`${api.url}/api/gif/${videoId}`, gifName)
    return
}

const checkNudity = async (path) => {

    const res = await axios.post(`${api.url}/api/video/checkNudity`, {
        path
    }, {
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    if (res.data.data.isNudity === '1') {
        //Gửi notification
    }

    return res
}

// show tag 
const getTagVideo = async (id) => {
    const res = await axios({
        method: 'GET',
        url: `${API_URL}/video/tag/${id}`,
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const deleteTag = async (id, tagName) => {
    const res = await axios({
        method: 'DELETE',
        url: `${API_URL}/video/tag/${id}`,
        data: {
            tagName
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const addTagManual = async (id, tagName) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/video/tag/${id}`,
        data: {
            tagName
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const autoTagging = async (path) => {
    return axios.post(`${api.url}/video/tag/autoTagging`, {
        path
    }, {
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })
}

const requestVideos = async (page, folderId) => {
    const res = await axios({
        method: 'GET',
        url: `http://localhost:5000/api/video/${localStorage.getItem('Username')}/${folderId}?page=${page}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const deleteVideo = async (id) => {
    const res = await axios({
        method: 'POST',
        url: `http://localhost:5000/video/deleteVideo`,
        data: {
            id
        },
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const getVideoList = async (folderId, currentPageVideo) => {
    const userName = localStorage.getItem('Username')
    const res = await axios({
        method: 'GET',
        url: `http://localhost:5000/api/video/${userName}/${folderId}?page=${currentPageVideo}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const removeBackground = async (path) => {
    const res = await axios({
        method: 'POST',
        url: `http://localhost:5000/video/removeBackground`,
        data: {
            path
        },
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const changeBgColor = async (color, path) => {
    const res = await axios({
        method: 'POST',
        url: `http://localhost:5000/video/changeBgColor`,
        data: {
            path,
            color
        },
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const changeBgImg = async (formData) => {
    const res = await axios({
        method: 'POST',
        url: `http://localhost:5000/video/changeBgImg`,
        data: formData,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const videoService = {
    changeVideoStatus,
    searchVideo,
    convertToGif,
    checkNudity,
    getTagVideo,
    addTagManual,
    deleteTag,
    autoTagging,
    requestVideos,
    deleteVideo,
    getVideoList,
    removeBackground,
    changeBgColor,
    changeBgImg
}

export default videoService