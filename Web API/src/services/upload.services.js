const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const axios = require('axios')

const db = require('../models')
const User = db.user
const Project = db.project
const Folder = db.folder
const Attachment = db.attachment
const storage = require('../config/storage.config.js')

ffmpeg.setFfmpegPath(storage.ffmpeg)

String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }

    return this.substring(0, index) + replacement + this.substring(index + 1);
}

function saveFileToDB(req) {
    // File
    const file = req.files.file
    // Tên file ban đầu
    let orginalFileName = file.name
    // lấy folderId
    let folderId = req.body.folderId
    // Tên file mà không có extension
    const fileNameCut = orginalFileName.substring(0, orginalFileName.indexOf('.'))
    // Extension của file
    const fileExtension = orginalFileName.substring(orginalFileName.indexOf('.'))

    const folder = Folder.findOne({
        where: {
            id: folderId
        }
    })
    const video = folder.then(folderInfo => {
        const project = Project.findOne({
            where: {
                id: folderInfo.dataValues.projectId
            }
        })

        const projectResult = project.then(projectInfo => {

            const user = User.findOne({
                where: {
                    id: projectInfo.dataValues.userId
                }
            })
            const userResult = user.then(userInfo => {
                // Đường dẫn lưu file
                let path = `${storage.storage}/${userInfo.dataValues.username}/${projectInfo.dataValues.projectName}/${folderInfo.dataValues.folderName}/${file.name}`
                // index sử dụng trong while
                let i = 1
                // Kiểm tra file tại đường dẫn lưu file đã tồn tại hay chưa
                while (fs.existsSync(path)) {
                    // Nếu có thì thay đổi tên file
                    file.name = fileNameCut + `(${i})` + fileExtension
                    // Cập nhật đường dẫn lưu file
                    path = `${storage.storage}/${userInfo.dataValues.username}/${projectInfo.dataValues.projectName}/${folderInfo.dataValues.folderName}/${file.name}`
                    // Cập nhật index cho vòng lập
                    i++
                }

                // Di chuyển file đến đường dẫn lưu file
                file.mv(`${path}`)

                try {
                    ffmpeg(`${path}`)
                        .screenshots({
                            timestamps: [1],
                            filename: `${fileNameCut}_thumbnail.png`,
                            folder: `${storage.storage}/${userInfo.dataValues.username}/${projectInfo.dataValues.projectName}/${folderInfo.dataValues.folderName}`,
                            size: '320x240'
                        });
                } catch (e) {
                    console.log(e)
                }

                const video = Attachment.create({
                    originalFileName: orginalFileName,
                    fileName: file.name,
                    url: `/api/video/stream/${userInfo.dataValues.username}/${projectInfo.dataValues.projectName}/${folderInfo.dataValues.folderName}/${file.name}`,
                    thumbnailName: `${fileNameCut}_thumbnail.png`,
                    path: `/${userInfo.dataValues.username}/${projectInfo.dataValues.projectName}/${folderInfo.dataValues.folderName}/${file.name}`,
                    publish: 0,
                    size: file.size,
                    mimetype: file.mimetype,
                    createUid: req.userId,
                    updateUid: req.userId,
                    folderId
                })

                video.then(value => {
                    Attachment.update({
                        thumbnailUrl: `/api/thumbnail/${userInfo.dataValues.username}/${projectInfo.dataValues.projectName}/${folderInfo.dataValues.folderName}/${value.dataValues.id}`
                    }, {
                        where: {
                            id: value.dataValues.id
                        }
                    })
                })
                return video
            })

            return userResult
        })

        return projectResult
    })

    return video
}


const saveImageToDB = async (req) => {

    const folderId = req.body.folderId
    console.log('reqq: ', req.files)
    for (var key in req.files) {
        const imgReq = req.files[key]
        let imgName = imgReq.name
        const imgNameCut = imgName.substring(0, imgName.indexOf('.'))
        const imgNameExtension = imgName.substring(imgName.indexOf('.'))
        let path
        let folderName
        let projectName

        await Folder.findByPk(folderId)
            .then(result => {
                folderName = result.dataValues.folderName
                return Project.findByPk(result.dataValues.projectId)
            })
            .then(result => {
                projectName = result.dataValues.projectName
                path = `${storage.storage}/${req.userName}/${result.dataValues.projectName}/${folderName}/${imgName}`
            })
        // index sử dụng trong while
        let i = 1
        // Kiểm tra file tại đường dẫn lưu file đã tồn tại hay chưa
        while (fs.existsSync(path)) {
            // Nếu có thì thay đổi tên file
            imgName = imgNameCut + `(${i})` + imgNameExtension
            // Cập nhật đường dẫn lưu file
            path = `${storage.storage}/${req.userName}/${projectName}/${folderName}/${imgName}`
            // Cập nhật index cho vòng lập
            i++
        }

        // Di chuyển file đến đường dẫn lưu file
        imgReq.mv(`${path}`)

        Attachment.create({
            originalFileName: imgReq.name,
            fileName: imgName,
            url: `/api/img/show/${req.userName}/${projectName}/${folderName}/${imgName}`,
            path: `/${req.userName}/${projectName}/${folderName}/${imgName}`,
            size: imgReq.size,
            mimetype: imgReq.mimetype,
            deleted: false,
            folderId: req.body.folderId
        })
    }
}

const uploadImageFromUrl = async (url, folderId, userName) => {
    let imgName = 'picture.png'
    let imgNameCut = imgName.substring(0, imgName.indexOf('.'))
    let imgNameExtension = imgName.substring(imgName.indexOf('.'))
    let path
    let folderName
    let projectName

    await Folder.findByPk(folderId)
        .then(result => {
            folderName = result.dataValues.folderName
            return Project.findByPk(result.dataValues.projectId)
        })
        .then(result => {
            projectName = result.dataValues.projectName
            path = `${storage.storage}/${userName}/${projectName}/${folderName}/${imgName}`
        })
    let i = 1
    while (fs.existsSync(path)) {
        // Nếu có thì thay đổi tên file
        imgName = imgNameCut + `(${i})` + imgNameExtension
        // Cập nhật đường dẫn lưu file
        path = `${storage.storage}/${userName}/${projectName}/${folderName}/${imgName}`
        // Cập nhật index cho vòng lập
        i++
    }
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    await response.data.pipe(fs.createWriteStream(path)) 
    const stats = fs.statSync(path)
    const size = stats.size
    console.log('size: ', size*1000)

    Attachment.create({
        originalFileName: imgName,
        fileName: imgName,
        url: `/api/img/show/${userName}/${projectName}/${folderName}/${imgName}`,
        path: `/${userName}/${projectName}/${folderName}/${imgName}`,
        size,
        mimetype: 'image/png',
        deleted: false,
        folderId: folderId
    })
}



module.exports = {
    saveFileToDB,
    saveImageToDB,
    uploadImageFromUrl
}