import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL
const token = localStorage.getItem('X-Auth-Token')

const getImages = async (folderId, page, size) => {
    const res = await axios({
        method: 'GET',
        url: `${API_URL}/image/${folderId}?page=${page}&size=${size}`,
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const uploadImages = async (formData) => {
    const res = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/uploadImages',
        data: formData,
        headers: {
            'x-access-token': token
        }
    })

    return res.data
}

const createVideo = async (formData) => {
    const res = await axios({
        method: "POST",
        url: `${API_URL}/image/createVideoFromImages`,
        data: formData,
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const removeBg = async (imgId) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/image/removebg`,
        data: {
            imgId
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const deleteImg = async (imgId) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/image/deleteImg`,
        data: {
            imgId
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const changeBgColor = async (color, path) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/image/changeBgColor`,
        data: {
            path,
            color
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const changeBgImg = async (formData) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/image/changeBgImg`,
        data: formData,
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const getTagImage = async (id) => {
    const res = await axios({
        method: 'GET',
        url: `${API_URL}/image/tag/${id}`,
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const deleteTag = async (id, tagName) => {
    const res = await axios({
        method: 'DELETE',
        url: `${API_URL}/image/tag/${id}`,
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
        url: `${API_URL}/image/tag/${id}`,
        data: {
            tagName
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const autoTagging = async (id) => {
    const res = await axios({
        method: 'post',
        url: `${API_URL}/image/tag/autoTagging`,
        data: {
            imageId: id
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}

const checkNudity = async (path) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/image/checkNudity`,
        data: {
            path
        },
        headers: {
            'x-access-token': token
        }
    })

    if (res.data.data.isNudity === '1') {
        //Gửi notification
    }

    return res
}

const uploadCloudinary = async (path) => {
    const res = await axios({
        method: 'post',
        url: `http://localhost:5000/image/uploadCloudinary`,
        data: {
            path
        },
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const uploadGoogleDrive = async (path) => {
    const res = await axios({
        method: 'post',
        url: `http://localhost:5000/image/uploadGoogleDrive`,
        data: {
            path
        },
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
    })

    return res
}

const uploadImageFromUrl = async (url) => {
    const res = await axios({
        method: 'POST',
        url: `${API_URL}/image/downloadGoogleDrive`,
        data: {
            url
        },
        headers: {
            'x-access-token': token
        }
    })

    return res
}


const imgService = {
    getImages,
    uploadImages,
    createVideo,
    removeBg,
    deleteImg,
    changeBgColor,
    changeBgImg,
    getTagImage,
    deleteTag,
    addTagManual,
    autoTagging,
    checkNudity,
    uploadCloudinary,
    uploadGoogleDrive,
    uploadImageFromUrl
}

export default imgService