const Sequelize = require('sequelize')
const { Op, QueryTypes } = require('sequelize')
const db = require('../models/index')
const mkdirp = require('mkdirp')
const storage = require('../config/storage.config')
const fs = require('fs')
const Folder = db.folder
const Project = db.project
const Attachment = db.attachment

function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};


const createFolder = async (folderName, projectId, userName) => {
    folderName = folderName.trim()
    let array = await Folder.findAll({
        where: {
            folderName,
            projectId
        }
    })

    // nếu có parentId
    // if (body.parentId === 'null') {
    //     delete body['parentId']
    //     // tìm xem có trùng tên folder ko trong TH parentId=null
    //     // array = await sequelize.query(`SELECT * FROM folders where folder_name = '${body.folderName}' AND project_id = ${body.projectId} 
    //     // AND parent_id is null`, { type: QueryTypes.SELECT });
    //     array = await Folder.findAll({
    //         where: {
    //             folderName: body.folderName,
    //             parentId: {
    //                 [Op.eq]: null
    //             },
    //             projectId: body.projectId
    //         }
    //     })
    // } else {
    //     // tìm xem có trùng tên folder ko trong TH parentId!=null
    //     array = await Folder.findAll({
    //         where: {
    //             folderName: body.folderName,
    //             projectId: body.projectId,
    //             parentId: body.parentId
    //         }
    //     })
    // }

    if (array.length !== 0) {
        return false
    } else {
        return Project.findByPk(projectId)
            .then(result => {
                mkdirp(`${storage.storage}/${userName}/${result.dataValues.projectName}/${folderName}`)
                return Folder.create({
                    folderName,
                    projectId
                })
            })
            .then(result => result)
    }

}

const updateFolder = async (newName, id, userName) => {
    try {
        let oldName

        let updateFolder = await Folder.findByPk(id)
        let array = await Folder.findAll({
            where:
            {
                folderName: newName,
                projectId: updateFolder.projectId,
                [Sequelize.Op.not]: {
                    id: id
                }
            }
        })

        if (array.length !== 0) {
            return false
        } else {
            Folder.findByPk(id)
                .then(result => {
                    oldName = result.dataValues.folderName
                    return Project.findByPk(result.dataValues.projectId)
                })
                .then(result => {
                    const oldPath = `${storage.storage}/${userName}/${result.dataValues.projectName}/${oldName}`
                    const newPath = `${storage.storage}/${userName}/${result.dataValues.projectName}/${newName}`
                    fs.renameSync(oldPath, newPath)
                })

            await Folder.update({ folderName: newName }, { where: { id } })

            // update path, url, thumbnailUrl của các attachment trong folder
            const listAttachmentInFolder = await Attachment.findAll({ where: { folderId: id } })
            for (let attachment of listAttachmentInFolder) {
                // change url
                const url = attachment.dataValues.url
                const arrUrl = url.split('/')
                arrUrl[6] = newName
                const newUrl = arrUrl.join('/')
                //change path
                const path = attachment.dataValues.path
                const arrPath = path.split('/')
                arrPath[3] = newName
                const newPath = arrPath.join('/')
                // change thumbnailurl
                if (attachment.dataValues.thumbnailUrl) {
                    const thumbnail = attachment.dataValues.thumbnailUrl
                    const arrThumbnail = thumbnail.split('/')
                    arrThumbnail[5] = newName
                    const newThumbnail = arrThumbnail.join('/')

                    await Attachment.update({ url: newUrl, path: newPath, thumbnailUrl: newThumbnail }, { where: { id: attachment.dataValues.id } })
                } else {
                    await Attachment.update({ url: newUrl, path: newPath }, { where: { id: attachment.dataValues.id } })
                }
            }
            return true
        }
    } catch (err) {
        console.log(err)
    }
}

//nếu id ko hợp lệ, ctrinh sẽ bị lỗi
const deleteFolder = (id, userName) => {
    try {
        let folderName
        return Folder.findByPk(id)
            .then(result => {
                folderName = result.dataValues.folderName
                return Project.findByPk(result.dataValues.projectId)
            })
            .then(result => {
                const path = `${storage.storage}/${userName}/${result.dataValues.projectName}/${folderName}`
                fs.rmSync(path, { recursive: true, force: true });
            })
            .then(() => {
                return Folder.destroy({ where: { id } })
            })
    } catch (error) {
        console.log('error: ___________________________________________________')
        console.log(error)
    }

}

const getAllFolder = () => {
    return Folder.findAll()
}

const getFolderById = (projectId, page, pageSize) => {
    const { limit, offset } = getPagination(page, pageSize)
    return Folder.findAndCountAll({
        where: {
            projectId,
            deleted: false
        },
        order: [
            ['id', 'DESC'],
        ],
        limit,
        offset
    })
    // if (parentId === 'null') {
    //     return Folder.findAndCountAll({
    //         where: {
    //             projectId,
    //             //parentId: null,
    //             deleted: false
    //         },
    //         order: [
    //             ['id', 'ASC'],
    //         ],
    //         limit,
    //         offset
    //     })

    // } else {
    //     return Folder.findAndCountAll({
    //         where: {
    //             projectId,
    //             parentId
    //         },
    //         order: [
    //             ['id', 'ASC'],
    //         ],
    //         limit,
    //         offset
    //     })
    // }
}


module.exports = {
    createFolder,
    updateFolder,
    deleteFolder,
    getAllFolder,
    getFolderById
}