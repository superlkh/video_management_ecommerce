const http_status = require('../http_responses/status.response.js')
const projectService = require('../services/project.service.js')

// Lấy danh sách thông tin những project của user chỉ định
const getProjects = (req, res) => {

    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Gọi xuống project service lấy danh sách thông tin project
        const projects = projectService.getProjectsDB(req.userId, req.query.page, req.query.search)

        projects.then(value => {
            // const page = value.slice(0, 9)
            if(!value){
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            } else {
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
                resObj.data = value
            }

            return res.json(resObj)
        })
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

// Lấy thông tin của một project chỉ định
const getOneProject = async (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Gọi xuống project service để lấy thông tin của project được chỉ định
        const project = await projectService.getOneProject(req.params.projectId)
           // Nếu project không tồn tại
           if(!project){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = 'Project does not exist'  
        } else {
            // Thông báo lấy thông tin thành công, trả về data
            resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            resObj.data = project
        }
        return res.json(resObj)
        
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

// Tạo một project của user chỉ định
const createProject = (req, res) =>{
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Gọi xuống project service tạo một project
        const project = projectService.createProject(req.userId, req.body)
        project.then(value => {
            // Thông báo đã có project khác của user trùng tên giống với trong requst
            if(!value){
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = "Project's name has already existed"
            } else{
                // Thành công tạo project, trả về thông tin project
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
                resObj.data = value.dataValues
            }
            return res.json(resObj)
        })
    } catch (error) {
        // Bắt lỗi
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

// Sửa đổi tên một project của user chỉ định
const changeProjectName = (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        // Gọi xuống project service sửa tên project
        const result = projectService.changeProjectName(req)
        result.then(value => {
            // Đã có một project khác của user trùng tên với tên mới trong request cung cấp
            if(!value){
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = "Project's name has already been taken!"
            }else if(value[0] === 0){
                // Project id không tồn tại
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors ='Project does not exist'
                return res.json(resObj)
            }else{
                // Thông báo thay đổi tên project thành công
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            }
           
            return res.json(resObj)
        })
    } catch (error) {
        // Bắt lỗi
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return res.json(resObj)
    }
}

const deleteProject = (req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = projectService.deleteProject(req)
        result.then(value => {
            if(value === 0){
                resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
                resObj.errors = 'Project not found'
            } else {
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
            }
            
            return res.json(resObj)
        })
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
        return resObj
    }
}

const searchProject = async(req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const result = await projectService.searchProject(req.userId, req.query)
        
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = result
        
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }
    return res.json(resObj)
}

const addUserProject = async(req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const invite = await projectService.addUserProject(req.userId, req.body.username, req.body.projectId)
        if(!invite){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
            resObj.errors = "Already invited or no project or user found"
            return res.json(resObj)
        } else {
                resObj.status = http_status.HTTP_RESPONE_STATUS_OK
                resObj.data = invite
        }
        
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const getWorkingProjects = async(req, res) => {
    let resObj = {
        status: null,
        errors: null,
        data: null,
    }

    try {
        const projects = await projectService.getWorkingProjects(req.userId, req.query.page, req.query.search)
        resObj.status = http_status.HTTP_RESPONE_STATUS_OK
        resObj.data = projects
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const findAllUsers = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await projectService.findAllUsers(req.userId, req.params.projectId)
        if(!result){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

module.exports = {
    createProject, 
    getProjects, 
    changeProjectName, 
    getOneProject, 
    deleteProject,
    searchProject,
    addUserProject,
    getWorkingProjects,
    findAllUsers
}