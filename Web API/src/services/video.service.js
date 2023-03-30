const db = require('../models')
const Folder = db.folder
const User = db.user
const Project = db.project
const Video = db.attachment
const Comment = db.comment
const UserProject = db.user_project

const fs = require('fs')
const fluent_ffmpeg = require('fluent-ffmpeg')
const ffmpeg = require('ffmpeg')
const videoshow = require('videoshow')
const { removeBackgroundFromImageFile } = require('remove.bg')
const FormData = require('form-data');
const path = require('path');
const axios = require('axios')

const storage = require('../config/storage.config')
const deepai = require('deepai')
const cloudinary = require('cloudinary')
const { Op } = require('sequelize')
const key = require('../config/key.config')
const cloudinary_config = require('../config/cloudinary.config')
const constant = require('../config/constant.config')

cloudinary.config({
    cloud_name: cloudinary_config.cloud_name,
    api_key: cloudinary_config.api_key,
    api_secret: cloudinary_config.api_secret
});

deepai.setApiKey(key.api_key_deepai);



function getUserVideos(folderId, page) {
    let videoPage = parseInt(page)
    if (videoPage === 0) {
        videoPage = 1
    }
    return Video.findAndCountAll({
        where: {
            folderId: folderId,
            mimetype: {
                [Op.startsWith]: 'video'
            },
            deleted: false
        },
        offset: (videoPage - 1) * 3,
        limit: 3,
        order: [
            ['id', 'ASC']
        ]
    })
}

function getThumbnail(userName, projectName, folderName, videoId) {
    return Video.findOne({
        where: {
            id: videoId
        }
    }).then(video => {
        return `${userName}/${projectName}/${folderName}/${video.dataValues.thumbnailName}`
    })

}

async function changeVideoStatus(req) {
    const status = parseInt(req.body.status)
    const statusResult = await User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        if (!user) {
            return
        }
        const project = Project.findOne({
            where: {
                id: req.body.projectId,
                userId: user.dataValues.id
            }
        }).then(projectInfo => {
            if (!projectInfo) {
                return
            }
            const folder = Folder.findOne({
                where: {
                    id: req.body.folderId,
                    projectId: projectInfo.dataValues.id
                }
            }).then(folderInfo => {
                if (!folderInfo) {
                    return
                }
                const result = Video.update({
                    publish: status
                }, {
                    where: {
                        id: req.params.videoId,
                        folderId: folderInfo.dataValues.id
                    }
                })

                return result
            })

            return folder
        })

        return project
    })

    return statusResult
}

async function searchVideo(req) {
    if (!req.query.page) {
        req.query.page = 1
    }

    const user = await User.findOne({
        where: {
            id: req.userId
        }
    })

    if (!user) {
        return
    }

    const projectInfo = await Project.findOne({
        where: {
            id: req.body.projectId,
        }
    })

    if (!projectInfo) {
        return
    }

    const folderInfo = await Folder.findOne({
        where: {
            id: req.body.folderId,
            projectId: projectInfo.dataValues.id
        }
    })

    if (!folderInfo) {
        return
    }

    if (req.query.type === '0') {
        const result = await Video.findAndCountAll({
            where: {
                fileName: {
                    [Op.substring]: req.query.videoName
                },
                folderId: folderInfo.dataValues.id,
                mimetype: {
                    [Op.startsWith]: 'video'
                },
                deleted: false
            },
            offset: (parseInt(req.query.page) - 1) * 3,
            limit: 3
        })

        return result
    } else if (req.query.type === '1') {
        const result = await Video.findAndCountAll({
            where: {
                fileName: {
                    [Op.substring]: req.query.videoName
                },
                folderId: folderInfo.dataValues.id,
                mimetype: {
                    [Op.startsWith]: 'image'
                },
                deleted: false
            },
            offset: (parseInt(req.query.page) - 1) * 3,
            limit: 3,
            order: [
                ['id', 'ASC']
            ]
        })

        return result
    }
    return
}

// Xem bình luận video
const getComments = async (userId, videoId, page) => {
    if (!page) {
        page = 1
    }

    const comments = await Comment.findAndCountAll({
        where: {
            attachmentId: videoId,
            commentParentId: null
        },
        offset: (parseInt(page) - 1) * 5,
        limit: 5,
        order: [
            ['created_at', 'DESC']
        ]
    })
    for (let i = 0; i < comments.rows.length; i++) {
        const user = await User.findOne({
            attributes: ['username'],
            where: {
                id: comments.rows[i].dataValues.userId
            }
        })
        comments.rows[i].dataValues.username = user.dataValues.username
    }

    return comments
}

const getChildComments = async (userId, videoId, commentId) => {

    const comments = await Comment.findAll({
        where: {
            attachmentId: videoId,
            commentParentId: commentId
        },
        order: [
            ['id', 'ASC']
        ]
    })
    for (let i = 0; i < comments.length; i++) {
        const user = await User.findOne({
            attributes: ['username'],
            where: {
                id: comments[i].dataValues.userId
            }
        })
        comments[i].dataValues.username = user.dataValues.username
    }

    return comments
}


// Bình luận video
const commentVideo = async (userId, videoId, body) => {
    // Kiểm tra người gửi request có tham gia vào project hay không
    // --Kiểm tra user có phải project manager hay không
    const project = await Project.findOne({
        where: {
            userId: userId,
        }
    })
    // --Kiểm tra user có phải là thành viên khác của project hay không
    const userProject = await UserProject.findOne({
        where: {
            userId: userId,
            projectId: body.projectId
        }
    })
    // --Nếu không phải 2 loại người ở trên thì không cho phép
    if (!userProject && !project) {
        return
    }

    // Kiểm tra video có tồn tại trong project và folder được chỉ định hay không
    const folder = await Folder.findOne({
        where: {
            id: body.folderId,
            projectId: body.projectId
        }
    })

    if (!folder) {
        return
    }

    const video = await Video.findOne({
        where: {
            id: videoId,
            folderId: folder.dataValues.id
        }
    })

    if (!video) {
        return
    }

    if (body.commentParentId) {
        const commentParent = await Comment.findOne({
            where: {
                id: body.commentParentId
            }
        })
        if (!commentParent) {
            return
        }
    }

    const result = await Comment.create({
        userId: userId,
        attachmentId: videoId,
        content: body.comment,
        commentParentId: body.commentParentId
    })

    return result
}

const updateComment = async (userId, commentId, newComment) => {
    const result = await Comment.update({
        content: newComment
    }, {
        where: {
            id: commentId,
            userId: userId
        }
    })

    return result
}

const deleteComment = async (userId, commentId) => {
    const result = await Comment.destroy({
        where: {
            id: commentId,
            userId: userId
        }
    })

    console.log(result)

    return result
}

const convertToGif = async (videoId) => {

    const video = await Video.findOne({
        where: {
            id: videoId
        }
    }).then(value => {
        if (!value) {
            return
        }
        const inputFile = storage.storage + value.dataValues.path
        const outputFile = inputFile.replace('mp4', 'gif')

        if (fs.existsSync(outputFile)) {
            return outputFile
        }

        fluent_ffmpeg(inputFile)
            .outputOption("-t", "3", "-vf", "scale=320:-1:flags=lanczos,fps=15", "-loop", "0")
            .save(outputFile)

        return outputFile
    })

    return video
}

const checkNudity = async (req) => {
    const tempPath = storage.tempPath
    const videoPath = storage.storage + req.body.path
    const newVideoPath = tempPath + '/temp.mp4'
    const directoryPath = tempPath + '/frames'

    fs.copyFileSync(videoPath, newVideoPath)

    return new Promise((resolve, reject) => {
        var process = new ffmpeg(newVideoPath);
        process.then(function (video) {
            video.fnExtractFrameToJPG(directoryPath, {
                every_n_frames: constant.FRAME_STEP,
                file_name: 'frame'
            }, async function (error, files) {
                if (error)
                    console.log('Error: ', error)
                try {
                    for (let i = 1; ; i++) {
                        let framePath = directoryPath + '/frame_' + i + '.jpg'
                        console.log('framePath:', framePath)
                        if (!fs.existsSync(framePath)) {
                            console.log('ko có ảnh')
                            break
                        }

                        var resp = await deepai.callStandardApi("nsfw-detector", {
                            image: fs.createReadStream(framePath)
                        });
                        console.log(resp.output.nsfw_score)
                        if (resp.output.nsfw_score > 0.5) {
                            fs.rmSync(newVideoPath, { recursive: true, force: true });
                            fs.rmSync(directoryPath, { recursive: true, force: true });
                            Video.update({ nudity: 1 }, { where: { path: req.body.path } })
                            console.log('true')
                            resolve(true)
                            return
                        }
                    }
                    fs.rmSync(newVideoPath, { recursive: true, force: true });
                    fs.rmSync(directoryPath, { recursive: true, force: true });
                    await Video.update({ nudity: -1 }, { where: { path: req.body.path } })
                    console.log('false')
                    resolve(false)
                } catch (error) {
                    reject(error)
                }
            })
        }, function (err) {
            reject(err)
        })
    })


}

const getTagVideo = async (id) => {
    try {
        const video = await Video.findByPk(id)
        return video.dataValues.tags
    } catch (err) {
        console.log('err: ', err)
    }
}

const deleteTag = async (id, tagName) => {
    try {
        const result = await Video.findByPk(id)
        const listTag = result.dataValues.tags
        const newListTag = listTag.filter(tag => tag !== tagName)
        return await Video.update({ tags: newListTag }, { where: { id } })
    } catch (err) {
        console.log('err: ', err)
    }
}

const addTagManual = async (id, tagName) => {
    try {
        const result = await Video.findByPk(id)
        let listTag = result.dataValues.tags
        listTag.push(tagName)
        return await Video.update({ tags: listTag }, { where: { id } })
    } catch (err) {
        console.log('err: ', err)
    }
}

const autoTagging = async (req) => {
    // sẽ lấy tempPath từ storage
    const tempPath = storage.tempPath
    const videoPath = storage.storage + req.body.path
    const newVideoPath = tempPath + '/temp.mp4'
    const directoryPath = tempPath + '/frames'

    fs.copyFileSync(videoPath, newVideoPath)

    return new Promise((resolve, reject) => {
        let tags = []
        var process = new ffmpeg(newVideoPath);
        resolve(process
            .then((video) => {
                console.log('then1')
                return new Promise(res => {
                    video.fnExtractFrameToJPG(directoryPath, {
                        every_n_frames: 1,
                        file_name: 'frame'
                    }, async function (error, files) {
                        if (error)
                            console.log('Error: ', error)
                        console.log('xong async 1')
                        res('then2')
                    })
                })
            })
            .then((result) => {
                console.log('then2: ', result)
                return new Promise(res => {
                    let arrAsyncOperator = []
                    for (let i = 1; ; i++) {
                        let framePath = directoryPath + '/frame_' + i + '.jpg'

                        if (!fs.existsSync(framePath)) {
                            console.log(framePath)
                            console.log('ko có ảnh')
                            break
                        }
                        arrAsyncOperator.push(new Promise(res => {
                            cloudinary.uploader.upload(framePath,
                                function (result) {
                                    if (result.tags) {
                                        tags = tags.concat(result.tags)
                                        console.log('tags: ', tags)
                                    }
                                    console.log('Khong co tags')
                                    res(true)
                                },
                                {
                                    public_id: "temp",
                                    categorization: cloudinary_config.autoTagging_type,
                                    auto_tagging: constant.AUTO_TAGGING_CONFIDENT
                                });

                        }))
                    }
                    res(Promise.all(arrAsyncOperator)
                        .then(() => {
                            console.log('xong async 2')
                            return ('then3')
                        })
                    )
                })
            })
            .then((result) => {
                console.log('then3: ', result)
                return cloudinary.v2.uploader.destroy('temp',
                    function (result) {
                        console.log('xong async 3')
                        fs.rmSync(newVideoPath, { recursive: true, force: true });
                        fs.rmSync(directoryPath, { recursive: true, force: true });
                        return 'then4'
                    });
            })
            .then(async (result) => {
                console.log('then4: ', result)
                tags = [...new Set(tags)]
                console.log('final tags: ', tags)
                await Video.update({ tags }, { where: { path: req.body.path } })
                console.log('xong async 4')
                return tags
            }))
    })
}

const softDeleteVideo = async (id) => {
    return await Video.update({ deleted: true }, { where: { id } })
}

const removeBackground = async (path) => {
    const temp_path = `${storage.tempPath}/temp`
    const video_path = `${storage.storage}${path}`
    const new_video_path = `${storage.tempPath}/videoTemp.mp4`
    fs.copyFileSync(video_path, new_video_path)
    var process = new ffmpeg(new_video_path);
    return process
        .then(function (video) {
            return new Promise(resolve => {
                video.fnExtractFrameToJPG(temp_path, {
                    every_n_frames: 1,
                    file_name: "frame"
                }, async function (error, files) {
                    if (!error)
                        console.log('Frames: ' + files);
                    if (error)
                        console.log('err: ', error.message)

                    let arrAsyncOperator = []
                    for (let i = 1; ; i++) {
                        let videoFramePath = `${temp_path}/frame_${i}.jpg`
                        if (!fs.existsSync(videoFramePath)) {
                            break
                        }
                        arrAsyncOperator.push(new Promise(resolve => {
                            removeBackgroundFromImageFile({
                                path: videoFramePath,
                                apiKey: key.api_key_removeBg,
                                size: "regular",
                                type: "auto",
                                format: "jpg",
                                outputFile: videoFramePath,
                                bg_color: 'white'
                            }).then((result) => {
                                console.log(`File saved to ${videoFramePath}`);
                                resolve(true)
                            }).catch((errors) => {
                                console.log(JSON.stringify(errors));
                            });
                        }))
                    }
                    console.log('then 1')
                    resolve(Promise.all(arrAsyncOperator))
                })
            })
        })
        .then(() => {
            console.log('Bat dau tao video')

            var noBgImages = []
            for (let i = 1; ; i++) {
                let videoFramePathNoBg = `${temp_path}/frame_${i}.jpg`
                if (!fs.existsSync(videoFramePathNoBg)) {
                    break
                }
                noBgImages.push(videoFramePathNoBg)
            }

            var videoOptions = {
                fps: 1,
                loop: 1,
                transition: false,
                videoBitrate: 1024,
                videoCodec: 'libx264',
                size: '640x640',
                outputOptions: ['-pix_fmt yuv420p'],
                format: 'mp4'
            }

            console.log('then 2')

            return new Promise(resolve => {
                videoshow(noBgImages, videoOptions)
                    .save(video_path)
                    .on('start', function (command) {
                        console.log('encoding ' + video_path + ' with command ' + command)
                    })
                    .on('error', function (err, stdout, stderr) {
                        return Promise.reject(new Error(err))
                    })
                    .on('end', function (output) {
                        console.log("Tạo video no background xong")
                        fs.rmSync(temp_path, { recursive: true, force: true })
                        fs.rmSync(new_video_path, { recursive: true, force: true })
                        resolve(output)
                    })
            })

        })
        .then(videoPath => {
            console.log('then 3')
            const stats = fs.statSync(videoPath)
            const size = stats["size"]
            return Video.update({ size }, {
                where: {
                    path
                }
            }).then(result => {
                return result
            })
        })
        .catch(function (err) {
            console.log('Error: ' + err);
        })
}

const changeBgColor = async (path, color) => {
    const temp_path = `${storage.tempPath}/temp`
    const video_path = `${storage.storage}${path}`
    const new_video_path = `${storage.tempPath}/videoTemp.mp4`
    fs.copyFileSync(video_path, new_video_path)
    var process = new ffmpeg(new_video_path);
    return process
        .then(function (video) {
            return new Promise(resolve => {
                video.fnExtractFrameToJPG(temp_path, {
                    every_n_frames: 1,
                    file_name: "frame"
                }, async function (error, files) {
                    if (!error)
                        console.log('Frames: ' + files);
                    if (error)
                        console.log('err: ', error.message)

                    let arrAsyncOperator = []
                    for (let i = 1; ; i++) {
                        let videoFramePath = `${temp_path}/frame_${i}.jpg`
                        if (!fs.existsSync(videoFramePath)) {
                            break
                        }
                        arrAsyncOperator.push(new Promise(resolve => {
                            removeBackgroundFromImageFile({
                                path: videoFramePath,
                                apiKey: key.api_key_removeBg,
                                size: "regular",
                                type: "auto",
                                format: "jpg",
                                outputFile: videoFramePath,
                                bg_color: color
                            }).then((result) => {
                                console.log(`File saved to ${videoFramePath}`);
                                resolve(true)
                            }).catch((errors) => {
                                console.log(JSON.stringify(errors));
                            });
                        }))
                    }
                    console.log('then 1')
                    resolve(Promise.all(arrAsyncOperator))
                })
            })
        })
        .then(() => {
            console.log('Bat dau tao video')

            var noBgImages = []
            for (let i = 1; ; i++) {
                let videoFramePathNoBg = `${temp_path}/frame_${i}.jpg`
                if (!fs.existsSync(videoFramePathNoBg)) {
                    break
                }
                noBgImages.push(videoFramePathNoBg)
            }

            var videoOptions = {
                fps: 1,
                loop: 1,
                transition: false,
                videoBitrate: 1024,
                videoCodec: 'libx264',
                size: '640x640',
                outputOptions: ['-pix_fmt yuv420p'],
                format: 'mp4'
            }

            console.log('then 2')

            return new Promise(resolve => {
                videoshow(noBgImages, videoOptions)
                    .save(video_path)
                    .on('start', function (command) {
                        console.log('encoding ' + video_path + ' with command ' + command)
                    })
                    .on('error', function (err, stdout, stderr) {
                        return Promise.reject(new Error(err))
                    })
                    .on('end', function (output) {
                        console.log("Tạo video no background xong")
                        fs.rmSync(temp_path, { recursive: true, force: true })
                        fs.rmSync(new_video_path, { recursive: true, force: true })
                        resolve(output)
                    })
            })

        })
        .then(videoPath => {
            console.log('then 3')
            const stats = fs.statSync(videoPath)
            const size = stats["size"]
            return Video.update({ size }, {
                where: {
                    path
                }
            }).then(result => {
                return result
            })
        })
        .catch(function (err) {
            console.log('Error: ' + err);
        })
}

const changeBgImg = async (req) => {
    const temp_path = `${storage.tempPath}/temp`
    const video_path = `${storage.storage}${req.body.path}`
    const new_video_path = `${storage.tempPath}/videoTemp.mp4`
    const image_bg_path = `${storage.tempPath}/${req.files.image.name}`
    // copy video sang path tạm
    fs.copyFileSync(video_path, new_video_path)
    // move file ảnh background xuống path tạm
    req.files.image.mv(image_bg_path)

    var process = new ffmpeg(new_video_path);
    return process
        .then(function (video) {
            return new Promise(resolve => {
                video.fnExtractFrameToJPG(temp_path, {
                    every_n_frames: 1,
                    file_name: "frame"
                }, async function (error, files) {
                    if (!error)
                        console.log('Frames: ' + files);
                    if (error)
                        console.log('err: ', error.message)

                    let arrAsyncOperator = []
                    for (let i = 1; ; i++) {
                        let videoFramePath = `${temp_path}/frame_${i}.jpg`
                        if (!fs.existsSync(videoFramePath)) {
                            break
                        }
                        arrAsyncOperator.push(new Promise(resolve => {
                            const formData = new FormData();
                            formData.append('size', 'auto');
                            formData.append('image_file', fs.createReadStream(videoFramePath), path.basename(videoFramePath));
                            formData.append('bg_image_file', fs.createReadStream(image_bg_path));
                            axios({
                                method: 'post',
                                url: 'https://api.remove.bg/v1.0/removebg',
                                data: formData,
                                responseType: 'arraybuffer',
                                headers: {
                                    ...formData.getHeaders(),
                                    'X-Api-Key': key.api_key_removeBg,
                                },
                                encoding: null
                            })
                                .then((response) => {
                                    if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                                    fs.writeFileSync(videoFramePath, response.data);
                                })
                                .then(result => {
                                    resolve(true)
                                })
                                .catch((error) => {
                                    return console.error('Request failed:', error);
                                });
                        }))
                    }
                    console.log('then 1')
                    resolve(Promise.all(arrAsyncOperator))
                })
            })
        })
        .then(() => {
            console.log('Bat dau tao video')

            var noBgImages = []
            for (let i = 1; ; i++) {
                let videoFramePathNoBg = `${temp_path}/frame_${i}.jpg`
                if (!fs.existsSync(videoFramePathNoBg)) {
                    break
                }
                noBgImages.push(videoFramePathNoBg)
            }

            var videoOptions = {
                fps: 1,
                loop: 1,
                transition: false,
                videoBitrate: 1024,
                videoCodec: 'libx264',
                size: '640x640',
                outputOptions: ['-pix_fmt yuv420p'],
                format: 'mp4'
            }

            console.log('then 2')

            return new Promise(resolve => {
                videoshow(noBgImages, videoOptions)
                    .save(video_path)
                    .on('start', function (command) {
                        console.log('encoding ' + video_path + ' with command ' + command)
                    })
                    .on('error', function (err, stdout, stderr) {
                        return Promise.reject(new Error(err))
                    })
                    .on('end', function (output) {
                        console.log("Tạo video no background xong")
                        fs.rmSync(temp_path, { recursive: true, force: true })
                        fs.rmSync(new_video_path, { recursive: true, force: true })
                        fs.rmSync(image_bg_path, { recursive: true, force: true })
                        resolve(output)
                    })
            })

        })
        .then(videoPath => {
            const stats = fs.statSync(videoPath)
            const size = stats["size"]
            return Video.update({ size }, {
                where: {
                    path: req.body.path
                }
            })
                .then(result => {
                    return result
                })
        })
        .catch(function (err) {
            console.log('Error: ' + err);
        })
}

module.exports = {
    getUserVideos,
    getThumbnail,
    changeVideoStatus,
    searchVideo,
    getComments,
    getChildComments,
    commentVideo,
    updateComment,
    deleteComment,
    convertToGif,
    checkNudity,
    getTagVideo,
    deleteTag,
    addTagManual,
    autoTagging,
    softDeleteVideo,
    removeBackground,
    changeBgColor,
    changeBgImg
}