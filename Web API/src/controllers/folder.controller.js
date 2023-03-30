const folderService = require('../services/folder.service')
const http_status = require('../http_responses/status.response')
const { HTTP_RESPONE_STATUS_UNKNOWN_ERROR } = require('../http_responses/status.response')


let constants = {
    PAGE_SIZE: 10
}



const createFolder = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        // return false: tên folder đã tồn tại, ngược lại return đối tượng tạo thành công
        let success = await folderService.createFolder(req.body.folderName, req.body.projectId, req.userName)
        if (success) {
            resObj.data = success
            // await mkdirp(`${storage.storage}/${req.userName}/${req.body.name}`)
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_REQUEST_DENIED
            resObj.data = {
                message: 'Folder name exist !'
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: 'create folder fail !!!',
            error: error.message
        }
    }
    res.json(resObj)
}

const updateFolder = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        // return false: tên folder đã tồn tại, thành công return số dòng update thành công
        let success = await folderService.updateFolder(req.body.folderName, req.params.folderId, req.userName)
        if (success) {
            resObj.data = true
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_REQUEST_DENIED
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    res.json(resObj)
}

const deleteFolder = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        const result = await folderService.deleteFolder(req.params.folderId, req.userName)
        resObj.data = {
            message: 'Delete successfully',
            result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: 'Delete failed'
        }
    }
    res.json(resObj)
}

const getAllFolder = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }
    try {
        const folders = await folderService.getAllFolder()
        resObj.data = folders
    } catch (error) {
        resObj.errors = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
    }
    res.json(resObj)
}

const getUserFolder = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }

    let projectId = req.params.projectId
    // let parentId = req.query.parentId
    let pageSize = req.query.size ? (Number(req.query.size) <= constants.PAGE_SIZE ? Number(req.query.size) : constants.PAGE_SIZE) : constants.PAGE_SIZE;
    let page = req.query.page ? Number(req.query.page) : 1;

    try {
        const result = await folderService.getFolderById(projectId, page, pageSize)
        resObj.data = {
            message: "Get folders successfully",
            parentId: req.query.parentId,
            listFolder: result.rows,
            count: result.count
        }

    } catch (error) {
        resObj.status = HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)
}


module.exports = {
    createFolder,
    updateFolder,
    deleteFolder,
    getAllFolder,
    getUserFolder
}