const { Op } = require("sequelize");
const { removeBackgroundFromImageFile } = require('remove.bg')
const videoshow = require('videoshow')
const axios = require('axios');
const fs = require('fs')
const FormData = require('form-data');
const path = require('path');
const cloudinary = require('cloudinary')
const fluent_ffmpeg = require('fluent-ffmpeg')
const deepai = require('deepai')
const { google } = require('googleapis');
const sharp = require('sharp')
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);

const cloudinary_config = require('../config/cloudinary.config')
const db = require('../models/index')
const storage = require('../config/storage.config')
const key = require('../config/key.config')

fluent_ffmpeg.setFfmpegPath(storage.ffmpeg)

const Attachment = db.attachment
const Folder = db.folder
const Project = db.project
const CloudinaryAccount = db.cloudinary
const GoogleAccount = db.googleAccount

cloudinary.config({
    cloud_name: cloudinary_config.cloud_name,
    api_key: cloudinary_config.api_key,
    api_secret: cloudinary_config.api_secret
});

deepai.setApiKey(key.api_key_deepai);

function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};

const getImgPath = (userName, projectName, folderName, imgName) => {
    return Attachment.findOne({
        where: {
            path: `/${userName}/${projectName}/${folderName}/${imgName}`
        }
    })
        .then(result => {
            return `${result.dataValues.path}`
        })
}

const getImages = (folderId, page, pageSize) => {
    const { limit, offset } = getPagination(page, pageSize)

    return Attachment.findAndCountAll({
        where: {
            folderId,
            deleted: false,
            mimetype: {
                [Op.startsWith]: 'image',
            }
        },
        order: [
            ['id', 'ASC'],
        ],
        limit,
        offset
    })
}

const createVideoFromImgs = async (folderId, resolution, listId, audio, userName) => {
    try {
        const audioPath = `${storage.storage}/${userName}/temp/${audio.name}`
        audio.mv(audioPath)
        listId = listId.split(',')
        let arrAsyncOperator = []

        for await (let i of listId) {
            arrAsyncOperator.push(Attachment.findByPk(i).then(row => {
                return `${storage.storage}${row.path}`
            }))
        }

        return Promise.all(arrAsyncOperator)
            .then(async (arrPathImg) => {
                const f = await createVideoFromImages(arrPathImg, userName, folderId, resolution, audioPath)
                console.log('finalVideoPath: ', f)
            })
    } catch (err) {
        console.log('err: ', err)
    }
}

async function createVideoFromImages(arrImg, userName, folderId, resolution, audioPath) {
    try {
        let secondsToShowEachImage = 5
        let videoName = 'video_temp.mp4'
        const folder = await Folder.findByPk(folderId)
        const projectId = folder.projectId
        const project = await Project.findByPk(projectId)
        let finalVideoPath = `${storage.storage}/${userName}/${project.projectName}/${folder.folderName}/${videoName}`
        const vidNameCut = videoName.substring(0, videoName.indexOf('.'))
        const vidExtension = videoName.substring(videoName.indexOf('.'))

        let i = 1
        while (fs.existsSync(finalVideoPath)) {
            // Nếu có thì thay đổi tên file
            videoName = vidNameCut + `(${i})` + vidExtension
            // Cập nhật đường dẫn lưu file
            finalVideoPath = `${storage.storage}/${userName}/${project.projectName}/${folder.folderName}/${videoName}`
            // Cập nhật index cho vòng lập
            i++
        }

        let resolution_HW
        switch (resolution) {
            case '240p':
                resolution_HW = '426x240'
                break
            case '360p':
                resolution_HW = '640x360'
                break
            case '480p':
                resolution_HW = '854x480'
                break
            case '720p':
                resolution_HW = '1080x720'
                break
            case '1080p':
                resolution_HW = '1920x1080'
                break
            default:
                resolution_HW = '426x240'
        }

        var videoOptions = {
            fps: 1,
            transition: false,
            videoBitrate: 1024,
            videoCodec: 'libx264',
            size: resolution_HW,
            outputOptions: ['-pix_fmt yuv420p'],
            format: 'mp4',
            loop: secondsToShowEachImage
        }

        // resize ảnh 
        // var images = []
        // for (let i = 0; i < arrImg.length; i++) {
        //     const outputFile = `${storage.storage}/${userName}/temp/${i}.png`
        //     sharp(arrImg[i]).resize({ height: 240, width: 426 }).toFile(outputFile)
        //         .then(function (newFileInfo) {
        //             // newFileInfo holds the output file properties
        //             console.log("Success")
        //         })
        //         .catch(function (err) {
        //             console.log("Error occured");
        //         });
        //     images.push(outputFile)
        // }

        // await videoshow(images, videoOptions)
        //     .audio(audioPath)
        //     .save(finalVideoPath)
        //     .on('start', function (command) {
        //         console.log('encoding ' + finalVideoPath + ' with command ' + command)
        //     })
        //     .on('error', function (err, stdout, stderr) {
        //         return Promise.reject(new Error(err))
        //     })
        //     .on('end', function (output) {
        //         console.log('1')
        //         fs.rmSync(audioPath, { recursive: true, force: true });
        //         for (let i of images) {
        //             fs.rmSync(i, { recursive: true, force: true })
        //         }
        //         writeVideoToDB(output, folderId, userName)
        //     })
        return new Promise(function (res, rej) {
            var images = []
            for (let i = 0; i < arrImg.length; i++) {
                const outputFile = `${storage.storage}/${userName}/temp/${i}.png`
                images.push(new Promise((res) => {
                    sharp(arrImg[i]).resize({ height: 240, width: 426 }).toFile(outputFile)
                        .then(function (newFileInfo) {
                            console.log("Success")
                            res(outputFile)
                        })
                }))
            }
            console.log('x')
            res(Promise.all(images)
                .then(images => {
                    console.log('images: ', images)
                    return images
                }))

        }).then(images => {
            console.log(images)
            return new Promise((res, rej) => {
                videoshow(images, videoOptions)
                    .audio(audioPath)
                    .save(finalVideoPath)
                    .on('start', function (command) {
                        console.log('encoding ' + finalVideoPath + ' with command ' + command)
                    })
                    .on('error', function (err, stdout, stderr) {
                        console.log('err: ', err)
                        return Promise.reject(new Error(err))
                    })
                    .on('end', async function (output) {
                        fs.rmSync(audioPath, { recursive: true, force: true });
                        for (let i of images) {
                            fs.rmSync(i, { recursive: true, force: true })
                        }
                        console.log('1')
                        await writeVideoToDB(output, folderId, userName)
                        res('hoan thanh')
                    })
            })
        }).then((result) => {
            console.log('result: ', result)
            return result
        })
    } catch (err) {
        console.log('err: ', err)
    }
}

async function writeVideoToDB(path, folderId, userName) {
    console.log('3')
    // tách tên video từ path 
    const temp = path.split('/')
    const videoName = temp[temp.length - 1]
    const fileNameCut = videoName.substring(0, videoName.indexOf('.'))

    // lấy size của video từ path
    const stats = fs.statSync(path)
    const size = stats["size"]

    // tạo thumbnail
    const folder = await Folder.findByPk(folderId)
    const projectId = folder.projectId
    const project = await Project.findByPk(projectId)
    try {
        fluent_ffmpeg(`${path}`)
            .screenshots({
                timestamps: [1],
                filename: `${fileNameCut}_thumbnail.png`,
                folder: `${storage.storage}/${userName}/${project.projectName}/${folder.folderName}`,
                size: '320x240'
            });
    } catch (e) {
        console.log(e)
    }

    await Attachment.create({
        originalFileName: videoName,
        fileName: videoName,
        url: `/api/video/stream/${userName}/${project.projectName}/${folder.folderName}/${videoName}`,
        thumbnailName: `${fileNameCut}_thumbnail.png`,
        path: `/${userName}/${project.projectName}/${folder.folderName}/${videoName}`,
        publish: 0,
        size,
        mimetype: 'video/mp4',
        deleted: false,
        folderId
    })// thêm trường thumbnail_url
        .then(value => {
            Attachment.update({
                thumbnailUrl: `/api/thumbnail/${userName}/${project.projectName}/${folder.folderName}/${value.dataValues.id}`
            }, {
                where: {
                    id: value.dataValues.id
                }
            })
        })
}





const removeImgBg = async (id) => {

    const result = await Attachment.findByPk(id)
    const inputPath = `${storage.storage}${result.dataValues.path}`
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
            ...formData.getHeaders(),
            'X-Api-Key': '2CWDsZEJXoEQWv8sk3fP1Qyp',
        },
        encoding: null
    })
        .then((response) => {
            if (response.status != 200) return console.error('Error:', response.status, response.statusText);
            fs.writeFileSync(inputPath, response.data);
            const stats = fs.statSync(inputPath)
            const size = stats["size"]
            Attachment.update({ size }, {
                where: {
                    path: `${result.dataValues.path}`
                }
            })
        })
        .catch((error) => {
            return console.error('Request failed:', error);
        });
}

const softDeleteImg = async (id) => {
    return await Attachment.update({ deleted: true }, { where: { id } })
}

const deleteImg = (id) => {
    return Attachment.findByPk(id)
        .then(result => {
            return `${storage.storage}${result.dataValues.path}`
        })
        .then(path => {
            fs.rmSync(path, { recursive: true, force: true });
            return Attachment.destroy({
                where: {
                    id
                }
            })
        })
        .then(result => {
            return result
        })
}

const changeBgColor = async (req) => {
    const color = req.body.color
    const path = `${storage.storage}${req.body.path}`

    return removeBackgroundFromImageFile({
        path: path,
        apiKey: key.api_key_removeBg,
        size: "regular",
        type: "auto",
        bg_color: color,
        outputFile: path
    })
        .then(() => {
            const stats = fs.statSync(path)
            const size = stats["size"]
            return Attachment.update({ size }, {
                where: {
                    path: req.body.path
                }
            })
        })
        .then(result => {
            return result
        })
        .catch((errors) => {
            console.log(JSON.stringify(errors));
        });
}

const changeBgImg = async (req) => {
    const imgBg = req.files.image
    const imgPath = req.body.path

    await imgBg.mv(`${storage.storage}/${req.userName}/temp/${imgBg.name}`)

    const inputPath = `${storage.storage}${imgPath}`
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
    formData.append('bg_image_file', fs.createReadStream(`${storage.storage}/${req.userName}/temp/${imgBg.name}`));

    return await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
            ...formData.getHeaders(),
            'X-Api-Key': '2CWDsZEJXoEQWv8sk3fP1Qyp',
        },
        encoding: null
    })
        .then((response) => {
            if (response.status != 200) return console.error('Error:', response.status, response.statusText);
            fs.writeFileSync(inputPath, response.data);

            const stats = fs.statSync(inputPath)
            const size = stats["size"]
            return Attachment.update({ size }, {
                where: {
                    path: imgPath
                }
            })
        })
        .then(result => {
            fs.rmSync(`${storage.storage}/${req.userName}/temp/${imgBg.name}`, { recursive: true, force: true });
            return result
        })
        .catch((error) => {
            return console.error('Request failed:', error);
        });
}

const getTagImage = async (id) => {
    const result = await Attachment.findByPk(id)
    return result.dataValues.tags
}

const deleteTag = async (id, tagName) => {
    const result = await Attachment.findByPk(id)
    const listTag = result.dataValues.tags
    const newListTag = listTag.filter(tag => tag !== tagName)
    return await Attachment.update({ tags: newListTag }, { where: { id } })
}

const addTagManual = async (id, tagName) => {
    try {
        const result = await Attachment.findByPk(id)
        let listTag = result.dataValues.tags
        listTag.push(tagName)
        return await Attachment.update({ tags: listTag }, { where: { id } })
    } catch (err) {
        console.log('err: ', err)
    }
}

const autoTagging = async (req) => {
    const imgId = req.body.imageId
    const attachmentFinding1 = await Attachment.findByPk(imgId)
    const imgPath = storage.storage + attachmentFinding1.path
    let tags

    await cloudinary.uploader.upload(imgPath,
        function (result) {
            tags = result.tags
        },
        {
            public_id: "temp",
            categorization: cloudinary_config.autoTagging_type,
            auto_tagging: 0.5
        });

    await Attachment.update({ tags }, { where: { id: imgId } })
    const attachmentFinding2 = await Attachment.findByPk(imgId)
    return {
        status: -1,
        tags: attachmentFinding2.dataValues.tags
    }
}

const checkNudity = async (req) => {
    const imgPath = storage.storage + req.body.path

    var resp = await deepai.callStandardApi("nsfw-detector", {
        image: fs.createReadStream(imgPath)
    });
    if (resp.output.nsfw_score > 0.5) {
        Attachment.update({ nudity: 1 }, { where: { path: req.body.path } })
        return true
    }
    else {
        Attachment.update({ nudity: -1 }, { where: { path: req.body.path } })
        return false
    }
}

const uploadCloudinary = async (userId, path) => {
    const account = await CloudinaryAccount.findOne({ where: { userId } })
    if (account !== null) {
        try {
            const imgPath = storage.storage + path
            cloudinary.config({
                cloud_name: account.cloudName,
                api_key: account.apiKey,
                api_secret: account.apiSecret,
                secure: true
            })
            return cloudinary.v2.uploader.upload(imgPath, {
                folder: 'ECommerceApp',
                use_filename: 'true',
                unique_filename: 'true'
            }, (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    return true
                }
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        return false
    }
}

const ClientId = key.client_id_google_cloud
const ClientSecret = key.client_secret_google_cloud
const RedirectionUrl = 'http://localhost:3000/auth/google/callback'
const oauth2Client = new google.auth.OAuth2(ClientId, ClientSecret, RedirectionUrl);

const uploadGoogleDrive = async (userId, path) => {
    const googleAccount = await GoogleAccount.findOne({ where: { userId } })
    if (googleAccount === null) {
        return false
    } else {
        const tokens = {
            access_token: googleAccount.accessToken,
            refresh_token: googleAccount.refreshToken,
            scope: googleAccount.scope,
            token_type: googleAccount.tokenType,
            expiry_date: googleAccount.expiryDate
        }
        oauth2Client.setCredentials(tokens)

        // lấy tên của ảnh
        const arr1 = path.split('/')
        const arr2 = arr1[arr1.length - 1].split('.')
        const pictureName = arr2[0]

        // upload
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(storage.storage + path),
        };
        const requestBody = {
            name: pictureName,
            mimeType: 'image/png',
        }
        return drive.files.create({ requestBody, media })
            .then(file => {
                console.log('fileId: ', file.data.id)
                return true
            })
            .catch(err => {
                console.log('err: ', err)
            })
    }
}

const downloadGoogleDrive = async (userId, url) => {
    try {
        const googleAccount = await GoogleAccount.findOne({ where: { userId } })
        if (googleAccount === null) {
            return false
        } else {
            const tokens = {
                access_token: googleAccount.accessToken,
                refresh_token: googleAccount.refreshToken,
                scope: googleAccount.scope,
                token_type: googleAccount.tokenType,
                expiry_date: googleAccount.expiryDate
            }
            oauth2Client.setCredentials(tokens)

            // lấy fileId của ảnh
            const arrSplit = url.split('/')
            const fileId = arrSplit[5]

            // download
            const dest = fs.createWriteStream('H:/photo.jpg')
            const drive = google.drive({ version: 'v3', auth: oauth2Client });
            drive.files.get({
                fileId,
                alt: 'media'
            },
                { responseType: "arraybuffer" },
                function (err, { data }) {
                    fs.writeFile("H:/photo.jpg", Buffer.from(data), err => {
                        if (err) console.log(err);
                    });
                })
            // .on('end', function () {
            //     console.log('Done');
            // })
            // .on('error', function (err) {
            //     console.log('Error during download', err);
            // })
            // .pipe(dest);
        }
    } catch (err) {
        console.log('err: ', err)
    }
}

module.exports = {
    getImgPath,
    getImages,
    createVideoFromImgs,
    removeImgBg,
    softDeleteImg,
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
    downloadGoogleDrive
}