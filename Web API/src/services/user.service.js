const bcrypt = require('bcrypt')
const axios = require('axios')
const { Op } = require('sequelize')
const { OAuth2Client } = require('google-auth-library');

const { folder } = require('../models')
const db = require('../models')
const key = require('../config/key.config')

const User = db.user
const Project = db.project
const Attachment = db.attachment
const Folder = db.folder
const UserProject = db.user_project
const CloudinaryAccount = db.cloudinary
const GoogleAccount = db.googleAccount



function isAdmin(userId) {

    const admin = User.findByPk(userId).then(function (user) {
        const USER = user.getRoles().then(function (roles) {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    return roles[i].name
                }
                return
            }
        })

        return USER

    })

    return admin

}

// Check if user is moderator
function isModerator(userId) {

    const moderator = User.findByPk(userId).then(function (user) {
        const USER = user.getRoles().then(function (roles) {

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    return roles[i].name
                }
                return
            }
        })

        return USER

    })

    return moderator

}

const searchUsers = async (managerId, username, projectId, page) => {
    if (!page) {
        page = 1
    }

    const userProject = await UserProject.findAll({
        where: {
            projectId: projectId
        }
    })

    let userIdProject = [managerId]
    for (let i = 0; i < userProject.length; i++) {
        userIdProject.push(userProject[i].dataValues.userId)
    }

    const user = await User.findAndCountAll({
        where: {
            username: {
                [Op.substring]: username
            },
            id: {
                [Op.notIn]: userIdProject
            }
        },
        offset: (parseInt(page) - 1) * 5,
        limit: 5
    }).then(value => {
        let userList = []
        for (let i = 0; i < value.rows.length; i++) {
            userList.push({
                id: value.rows[i].dataValues.id,
                username: value.rows[i].dataValues.username
            })
        }
        let data = {
            count: value.count,
            rows: userList
        }
        return data
    })

    return user
}



const getUsersInfo = async (userId, page, search) => {
    if (!page) {
        page = 1
    }

    const admin = await isAdmin(userId)

    if (!admin) {
        return
    }

    let offsetStart = (parseInt(page) - 1) * 5

    if (offsetStart < 0) {
        offsetStart = 0
    }

    if (!search) {
        const users = await User.findAndCountAll({
            limit: 5,
            offset: offsetStart
        })
        return users
    } else {
        const users = await User.findAndCountAll({
            where: {
                username: {
                    [Op.substring]: search
                }
            },
            limit: 5,
            offset: offsetStart
        })
        return users
    }



}


const getOneUser = async (userId) => {
    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    return user
}

const userDashBoard = async (userId) => {

    const projects = await Project.findAndCountAll({
        where: {
            userId: userId
        }
    })

    let folderCount = 0
    let videoCount = 0
    let imageCount = 0

    for (let i = 0; i < projects.count; i++) {
        const folders = await Folder.findAndCountAll({
            where: {
                projectId: projects.rows[i].id
            }
        })

        folderCount += folders.count

        for (let j = 0; j < folders.count; j++) {
            const videos = await Attachment.count({
                where: {
                    mimetype: {
                        [Op.startsWith]: 'video'
                    },
                    folderId: folders.rows[j].id
                }
            })
            const images = await Attachment.count({
                where: {
                    mimetype: {
                        [Op.startsWith]: 'image'
                    },
                    folderId: folders.rows[j].id
                }
            })

            videoCount += videos
            imageCount += images
        }
    }

    const userFinding = await User.findByPk(userId)
    const usage = Math.round((userFinding.memory / userFinding.totalMemory) * 10000) / 100

    const result = {
        project: projects.count,
        folder: folderCount,
        video: videoCount,
        image: imageCount,
        usage
    }

    return result
}

const getUserStorage = async (userId) => {
    try {
        const projects = await Project.findAll({ where: { userId } })
        let arrProject = []
        let arrFolder = []
        let arrMemory = []
        let totalMemory = 0
        for (let i = 0; i < projects.length; i++)
            arrProject.push(projects[i].dataValues.id)
        const folders = await Folder.findAll({ where: { projectId: [...arrProject] } })
        for (let i = 0; i < folders.length; i++)
            arrFolder.push(folders[i].dataValues.id)
        const attachments = await Attachment.findAll({ where: { folderId: [...arrFolder] } })
        for (let i = 0; i < attachments.length; i++)
            arrMemory.push(attachments[i].dataValues.size)
        for (let i of arrMemory)
            totalMemory += +i
        return totalMemory
    } catch (err) {
        console.log('err:', err)
    }
}

const updateUserStorage = async () => {
    try {
        const listUser = await User.findAll()
        for (let i of listUser) {
            const userId = i.dataValues.id
            const totalMemory = await getUserStorage(userId)
            await User.update({ memory: totalMemory }, { where: { id: userId } })
        }
        console.log('update xong')
    } catch (err) {
        console.log(err)
    }
}

const changePassword = async (req) => {
    try {
        const userName = req.userName
        const currentPassword = req.query.currentPassword
        const newPassword = req.query.password
        console.log(userName)
        console.log(currentPassword)
        console.log(newPassword)

        const userFinding = await User.findOne({ where: { username: userName } })
        const decodePassword = userFinding.dataValues.password
        const passwordIsValid = bcrypt.compareSync(currentPassword, decodePassword)

        if (!passwordIsValid) {
            return false
        }

        await User.update({ password: bcrypt.hashSync(newPassword, 8) }, { where: { username: userName } })
        return true
    } catch (err) {
        console.log(err)
    }
}
// Soft Delete
const changeDeleteStatus = async (adminId, userId, deleteStatus) => {

    if (!isAdmin(adminId)) {
        return
    }

    const result = await User.update({
        deleted: deleteStatus
    }, {
        where: {
            id: userId
        }
    })

    return result
}

const connectCloudinary = async (userId, information) => {
    console.log(userId)
    console.log(information.apiKey)
    console.log(information.apiSecret)
    console.log(information.cloudName)
    return axios({
        method: 'get',
        url: `https://${information.apiKey}:${information.apiSecret}@api.cloudinary.com/v1_1/${information.cloudName}/ping`
    })
        .then(async () => {
            await CloudinaryAccount.create({
                userId,
                cloudName: information.cloudName,
                apiKey: information.apiKey,
                apiSecret: information.apiSecret
            })
            return 1
        })
        .catch(error => {
            console.log(error.response.status)
            if (error.response.status === 401)
                return -1
            return 0
        })

}

const connectGoogleAccount = async (accountInfo, userId) => {

    const client = new OAuth2Client(key.client_id_google_cloud);
    const ticket = await client.verifyIdToken({
        idToken: accountInfo.tokenId,
        audience: key.client_id_google_cloud
    });

    const { name, email, picture } = ticket.getPayload();
    console.log(userId)
    console.log(accountInfo.accessToken)
    console.log(accountInfo.tokenId)
    console.log(accountInfo.tokenObj.expires_at)
    console.log(name)
    console.log(email)
    console.log(picture)
    await GoogleAccount.create({
        userId,
        accessToken: accountInfo.accessToken,
        idToken: accountInfo.tokenId,
        expireAt: accountInfo.tokenObj.expires_at,
        name,
        email,
        picture
    })
    return {
        name,
        email,
        picture
    }
}

const checkLoginGoogle = async (userId) => {
    const result = await GoogleAccount.findOne({ where: { userId } })
    if (result) {
        return {
            name: result.dataValues.name,
            picture: result.dataValues.picture
        }
    } else {
        return false
    }
}

module.exports = {
    isAdmin,
    isModerator,
    searchUsers,
    getUsersInfo,
    getOneUser,
    userDashBoard,
    getUserStorage,
    updateUserStorage,
    changePassword,
    changeDeleteStatus,
    connectCloudinary,
    connectGoogleAccount,
    checkLoginGoogle
}