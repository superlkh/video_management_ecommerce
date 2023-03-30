const storage = require('../config/storage.config')
const imageService = require('../services/image.service')
const http_status = require('../http_responses/status.response')
const constant = require('../config/constant.config')


const getImage = (req, res) => {
    const params = req.params
    try {
        res.sendFile(`${storage.storage}/${params.userName}/${params.projectName}/${params.folderName}/${params.imgName}`)
        // imageService.getImgPath(params.userName, params.projectName, params.folderName, params.imgName)
        //     .then(path => {

        //         res.sendFile(`${storage.storage}/${path}`)
        //     })
    } catch (error) {

    }

}

const getImageList = (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null
    }

    let folderId = req.params.folderId
    let pageSize = req.query.size ? (Number(req.query.size) <= constant.PAGE_SIZE_IMAGE ? Number(req.query.size) : constant.PAGE_SIZE_IMAGE)
        : constant.PAGE_SIZE_IMAGE
    let page = req.query.page ? Number(req.query.page) : 1

    try {
        imageService.getImages(folderId, page, pageSize)
            .then(result => {
                resObj.data = {
                    message: "Get images successfully",
                    folderId,
                    listImage: result.rows,
                    count: result.count
                }
            })
            .then(() => {
                res.json(resObj)
            })

    } catch (error) {
        resObj.status = HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
        res.json(resObj)
    }
}

const createVideoFromImages = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }

    try {
        const body = req.body
        const result = await imageService.createVideoFromImgs(body.folderId, body.resolution, body.listId, req.files.audio, req.userName)
        console.log(result)
        console.log('controller')
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }
    res.json(resObj)
}

const removeBg = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {

        await imageService.removeImgBg(req.body.imgId)
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)
}

const deleteImg = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return số dòng update deleted=true (soft delete)
        const result = await imageService.softDeleteImg(req.body.imgId)

        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                message: 'Delete successfully'
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)

}

const changeBgColor = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return số dòng update size của ảnh sau khi change bg
        const isSuccess = await imageService.changeBgColor(req)

        if (isSuccess) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                message: 'Change background successfully'
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)

}

const changeBgImg = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return số dòng update size của ảnh sau khi change bg
        const isSuccess = await imageService.changeBgImg(req)
        if (isSuccess) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                message: 'Change background successfully'
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        resObj.data = {
            message: error.message
        }
    }

    res.json(resObj)
}

const getTagImage = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return 1 mảng các tag của image
        const result = await imageService.getTagImage(req.params.imageId)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                tags: result
            }
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                tags: []
            }
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }
    res.json(resObj)
}

const autoTagging = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return 1: tags da duoc them truoc do roi, -1: tags vua dc them
        const result = await imageService.autoTagging(req)
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = result

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }
    res.json(resObj)
}

const deleteTag = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return về số lượng ảnh update lại tag
        const result = await imageService.deleteTag(req.params.imageId, req.body.tagName)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }


    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }
    res.json(resObj)
}

const addTagManual = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null
    }
    try {
        // return về số lượng ảnh update lại tag
        const result = await imageService.addTagManual(req.params.imageId, req.body.tagName)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = result
        }


    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }
    res.json(resObj)
}

const checkNudity = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    try {
        // return 1: co nudity, -1: ko co
        const isNudity = await imageService.checkNudity(req)

        if (isNudity) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                isNudity: 1
            }
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = {
                isNudity: -1
            }
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }
    return res.json(resObj)
}

const uploadCloudinary = async (req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }
    try {
        // return true: upload thanh cong, false: that bai
        const result = await imageService.uploadCloudinary(req.userId, req.body.path)
        if (!result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_REQUEST_DENIED
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }

    return res.json(resObj)
}

const uploadGoogleDrive = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    try {
        // return true: upload thanh cong, false: chưa connect google account
        const result = await imageService.uploadGoogleDrive(req.userId, req.body.path)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_REQUEST_DENIED
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }

    return res.json(resObj)
}

const downloadGoogleDrive = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }
    try {
        // return true: download thanh cong, false: chưa connect google account
        const result = await imageService.downloadGoogleDrive(req.userId, req.body.url)
        if (result) {
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        } else {
            resObj.status = http_status.HTTP_RESPONE_STATUS_REQUEST_DENIED
        }

    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error

        console.log(error.message)
    }

    return res.json(resObj)
}

module.exports = {
    getImage,
    getImageList,
    createVideoFromImages,
    removeBg,
    deleteImg,
    changeBgColor,
    changeBgImg,
    getTagImage,
    autoTagging,
    deleteTag,
    addTagManual,
    checkNudity,
    uploadCloudinary,
    uploadGoogleDrive,
    downloadGoogleDrive
}