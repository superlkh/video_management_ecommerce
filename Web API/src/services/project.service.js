const db = require('../models')
const Project = db.project
const Folder = db.folder
const User = db.user
const Video = db.attachment
const UserProject = db.user_project
const storage = require('../config/storage.config.js')
const mkdirp = require('mkdirp')
const fs = require('fs')
const { Op, where } = require('sequelize')
const { project } = require('../models')

const getProjectsDB = (userId, page, search) => {
    // Lấy danh sách project của user chỉ định trong database
    if(!page) {
        page = 1
    }
    const size = 5
    const offsetStart = (parseInt(page) - 1) * size
    if(offsetStart < 0){
        offsetStart = 0
    }

    if(!search){
        const projects = Project.findAndCountAll({
            where: {
                userId: userId
            },
            offset: offsetStart,
            limit: size,
            order: [
                ['id', 'ASC']
            ]
        })

        return projects
    } else {
        const projects = Project.findAndCountAll({
            where: {
                userId: userId,
                projectName: {
                    [Op.substring]: search
                }
            },
            offset: offsetStart,
            limit: size,
            order: [
                ['id', 'ASC']
            ]
        })

        return projects
    }
   
    
}

const getOneProject = async (projectId) => {

    // Tìm project với tên project id và user id
    const project = await Project.findOne({
        where: {
            id: projectId
        }
    })

    if(!project){
        return
    }

    const user = await User.findOne({
        where: {
            id: project.dataValues.userId
        }
    })

    const projectRecords = await UserProject.findAll({
        where: {
            projectId: project.dataValues.id
        }
    })

    let member = []
    for(let i = 0; i < projectRecords.length; i++){
        const projectMember = await User.findOne({
            where: {
                id: projectRecords[i].dataValues.userId
            }
        })
        member.push(projectMember.dataValues.username)
    }

    const result = {
        projectName: project.dataValues.projectName,
        tag: project.dataValues.tag,
        description: project.dataValues.description,
        createdAt: project.dataValues.createdAt,
        updatedAt: project.dataValues.createdAt,
        manager: user.dataValues.username,
        projectMember: member
    }
    
    return result
}

const createProject = (userId, projectInfo) => {

    // Thay đổi url của project
    let projectUrl = projectInfo.projectName
    let prevProjectUrl = null
    // Thay các khoảng trắng ' ' bằng dấu gạch nối '-' cho url của project 
    while(prevProjectUrl !== projectUrl){
        prevProjectUrl = projectUrl
        projectUrl = projectUrl.replace(' ', '-')
    }

    // Tìm kiếm user trong database bằng userId được truyền vào hàm
    const user = User.findOne({
        where:  {
            id: userId
        }
    })

    const project = user.then(userInfo => {
        // Nếu user không tồn tại
        if(!userInfo){
            return
        }

        // Tìm project trùng tên
        const duplicateProject = Project.findOne({
            where:{
                projectName: projectInfo.projectName
            }
        }).then(value => {
            // Nếu có thì return
            if (value){
                return
            }
            
             // Tạo project trong database
            const projectDB = Project.create({
                projectName: projectInfo.projectName,
                tag: projectInfo.tag,
                description: projectInfo.description,
                path:`/${userInfo.dataValues.username}/${projectInfo.projectName}`,
                userId: userInfo.dataValues.id
            })
        
            projectDB.then(value => {
                Project.update({
                    url: `/api/project/${value.dataValues.id}`,
                },{
                    where:{
                        id: value.dataValues.id
                    }
                })
            })

            // Tạo project trong thư mục gốc của user
            mkdirp(`${storage.storage}/${userInfo.dataValues.username}/${projectInfo.projectName}`)

            return projectDB
        })

        return duplicateProject
    })

    return project
}

const changeProjectName = (req) => {

    const newProjectName = req.body.projectName
    // Thay đổi url của project
    let newProjectUrl = newProjectName
    let prevProjectUrl = null
    // Thay các khoảng trắng ' ' bằng dấu gạch nối '-' cho url của project
    while(prevProjectUrl !== newProjectUrl){
        prevProjectUrl = newProjectUrl
        newProjectUrl = newProjectUrl.replace(' ', '-')
    }

    // Tìm project có User ID và project name được cung cấp trong hàm
    const isSuccess = Project.findOne({
        where:{
            userId: req.userId,
            projectName: newProjectName
        }
    }).then(value => {
        // Nếu có project trùng tên với tên project mới thì return
        if(value){
            return
        }

        const project = Project.findOne({
            where: {
                userId: req.userId,
                id: req.params.projectId
            }
        }).then(value => {
            // Nếu không tìm được project nào thì return
            if(!value){
                return
            }

            // Update project
            // Đường dẫn cũ của project trong thư mục
            const oldPath = `${storage.storage}/${req.userName}/${value.dataValues.projectName}`
            // Đường dẫn mới của project trong thư mục
            const newPath = `${storage.storage}/${req.userName}/${newProjectName}`
            // Đổi tên project trong thư mục
            fs.renameSync(oldPath, newPath)
             // Update tên project, url của project và đường dẫn trong thư mục trong database
             const result = Project.update({
                projectName: req.body.projectName,
                url: `/api/project/${req.params.projectId}`,
                path: `/${req.userName}/${newProjectName}`,
                tag: req.body.tag,
                description: req.body.description
            },{
                where:{
                    id: req.params.projectId
                }
            })
            Folder.findAll({
                where: {
                    projectId: req.params.projectId
                }
            }).then(folderInfo => {
                
                for (let i = 0; i < folderInfo.length; i++){
                    Video.findAll({
                        where: {
                            folderId: folderInfo[i].dataValues.id
                        }
                    }).then(value => {
                        for (let j = 0; j < value.length; j++){
                            Video.update({
                                url: `/api/video/stream/${req.userName}/${req.body.projectName}/${folderInfo[i].dataValues.folderName}/${value[j].dataValues.fileName}`,
                                path: `/${req.userName}/${req.body.projectName}/${folderInfo[i].dataValues.folderName}/${value[j].dataValues.fileName}`,
                                thumbnailUrl: `/api/thumbnail/${req.userName}/${req.body.projectName}/${folderInfo[i].dataValues.folderName}/${value[j].dataValues.id}`
                            },{
                                where: {
                                    id: value[j].dataValues.id
                                }
                            })
                        }
                    })
                }
            })
    
            return result
        })

        return project
    })

    return isSuccess
}

const deleteProject = (req) => {
    const result = Project.destroy({
        where:{
            id: req.params.projectId,
            userId: req.userId
        }
    })

    return result
}

const searchProject = async (userId, query) =>{
    const user = await User.findOne({
        where: {
            id: userId
        }
    })

    if(query.type === '0'){
        const project = await Project.findAndCountAll({
            where: {
                projectName: {
                    [Op.substring]: query.projectName
                },
                userId: user.dataValues.id
            },
            offset: (parseInt(query.page) - 1) * 5,
            limit: 5
        })

        return project
    }

    const result = {}
    let searchedProjects = []
    if (query.type === '1'){
        const projects = await UserProject.findAndCountAll({
            where: {
                userId: user.dataValues.id
            },
            offset: (parseInt(query.page) - 1) * 5,
            limit: 5
        })
        
        result.count = projects.count

        for(let i = 0; i < projects.rows.length; i++){
            const project = await Project.findOne({
                where: {
                    projectName: {
                        [Op.substring]: query.projectName
                    },
                    id: projects.rows[i].dataValues.projectId
                }
            })
            
            searchedProjects.push(project)
        }    

        result.rows = searchedProjects
    }
   
    return result
}

const addUserProject = async(managerId, username, projectId) => {
    
    const user = await User.findOne({
        where: {
            username: username
        }
    }).then(userInfo => {
        if(!userInfo){
            return
        }
        
        const project = Project.findOne({
            where: {
                id: projectId,
                userId: managerId
            }
        }).then(projectInfo => {
            if(!projectInfo){
                return
            }
            const user_project = userInfo.addProjects(projectInfo, {
                through: {
                    projectId: projectInfo.dataValues.id,
            }})
            return user_project
        })

        return project
        
    })

    return user
}

const getWorkingProjects = async(userId, page, search) => {

    if(!page){
        page = 1
    }
    let projects = {}
    projects.rows = []

    const size = 5
    const offsetStart = (parseInt(page) - 1) * size
    if(offsetStart < 0){
        offsetStart = 0
    }

    const result = await UserProject.findAndCountAll({
        where: {
            userId: userId
        },
        offset: offsetStart,
        limit: size
    })

    projects.count = result.count

    if(!search){
        for (let i = 0; i < 5; i++){
            if(!result.rows[i]){
                break
            }
            const project = await Project.findOne({
                where: {
                    id: result.rows[i].dataValues.projectId,
                }
            })
            
            projects.rows.push(project)
            
        }
    } else {
        for (let i = 0; i < 5; i++){
            if(!result.rows[i]){
                break
            }
            const project = await Project.findOne({
                where: {
                    id: result.rows[i].dataValues.projectId,
                    projectName: {
                        [Op.substring]: search
                    }
                }
            })
            projects.rows.push(project)
        }
    }

    return projects
}

const findAllUsers = async(userId, projectId) => {
    const managerId = await Project.findOne({
        attributes: ['user_id'],
        where: {
            id: projectId
        }
    })
    
    let usersArr = [managerId.dataValues.user_id]
    const participantsId = await UserProject.findAll({
        attributes: ['user_id'],
        where: {
            projectId: projectId
        }
    })

    for(let i = 0; i < participantsId.length; i++){
        usersArr.push(parseInt(participantsId[i].dataValues.user_id))
    }

    const filter = usersArr.filter(id => id !== parseInt(userId))
    
    if(filter.length === usersArr.length){
        return
    }

    const project = await Project.findOne({
        attributes: ['project_name'],
        where: {
            id: projectId
        }
    })
    
    const result = {
        projectName: project.dataValues.project_name,
        users: filter
    }

    return result
}

module.exports = {
    createProject, 
    getProjectsDB, 
    changeProjectName, 
    getOneProject, 
    deleteProject,
    searchProject,
    addUserProject,
    getWorkingProjects,
    findAllUsers
}
