import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const getFolders = (parentId, projectId, page, size) => {
    const token = localStorage.getItem('X-Auth-Token')
    
    return axios.get(`${API_URL}/folder/${projectId}?parentId=${parentId}&page=${page}&size=${size}`, {
        headers: {
            'x-access-token': token
        }
    })
        .then(res => {
            return res.data
        })
}

const createFolder = (projectId, folderName) => {
    const token = localStorage.getItem('X-Auth-Token')
    return axios.post(`${API_URL}/folder`, {
        projectId,
        folderName
    }, {
        headers: {
            'x-access-token': token
        }
    })
        .then(res => {
            return res.data
        })
}

const deleteFolder = (folderId) => {
    const token = localStorage.getItem('X-Auth-Token')
    return axios.delete(`${API_URL}/folder/${folderId}`, {
        headers: {
            'x-access-token': token
        }
    })
        .then(res => {
            return res.data
        })
}

const updateFolder = (folderId, newName) => {
    const token = localStorage.getItem('X-Auth-Token')
    return axios.put(`${API_URL}/folder/${folderId}`, {
        folderName: newName
    }, {
        headers: {
            'x-access-token': token
        }
    })
        .then(res => {
            return res.data
        })
}


export const folderService = {
    getFolders,
    deleteFolder,
    createFolder,
    updateFolder
}