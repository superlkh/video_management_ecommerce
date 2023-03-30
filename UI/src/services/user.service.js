import axios from 'axios'
import api from '../config/api.config'

const getUsersInfo = async (page, keyWord) => {

    const res = await axios({
        method: 'get',
        url: `${api.url}/api/all-user`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        params: {
            page: page,
            search: keyWord
        },
    })

    return res
}

const searchUsers = async (username, projectId, page) => {
    const res = await axios({
        method: 'post',
        url: `${api.url}/api/user`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        params: {
            username: username,
            projectId: projectId,
            page: page
        }
    })

    return res
}

const updateUserStorage = async () => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/user/updateUserStorage`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })
    console.log('uservice ui')
    return res.data
}

const getOneUser = async () => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/user`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const userDashBoard = async () => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/user/dashboard`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const changePassword = async (registrationData) => {
    const res = await axios({
        method: 'post',
        url: `${api.url}/user/changePassword`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        params: {
            ...registrationData
        }
    })
    return res.data
}

const softDeleteUser = async (userId, status) => {
    const res = await axios({
        method: 'put',
        url: `${api.url}/api/user`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        data: {
            userId: userId,
            deleteStatus: status
        }
    })

    return res
}

const connectCloudinary = async (registrationData) => {
    const res = await axios({
        method: 'post',
        url: `${api.url}/user/connectCloudinary`,
        data: {
            ...registrationData
        },
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const userServices = {
    searchUsers,
    getUsersInfo,
    getOneUser,
    userDashBoard,
    updateUserStorage,
    changePassword,
    softDeleteUser,
    connectCloudinary
}

export default userServices