import axios from 'axios'
import api from '../config/api.config'
import notificationService from './notification.service'
import notifConfig from '../config/notification.config'

const getUserProjects = async (page, keyWord) =>{

    const res = await axios.get(`${api.url}/api/project`, {
        headers: {
          'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        params: {
          page: page,
          search: keyWord
        }  
    })
   
    return res
}

const getOneUserProject = (projectId) =>{

  const res = axios.get(`${api.url}/api/project/${projectId}`, {
      headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
      }
    })
 
  return res
}

const createProject = async (projectInfo) =>{

  const res = await axios.post(`${api.url}/api/project/`, projectInfo, {
      headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
      }
  })

 
  return res
}

const changeProjectName = async (projectInfo, projectId) => {

  const res = await axios({
    method: 'put',
    url: `${api.url}/api/project/${projectId}`,
    headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
    }, 
    data: {
        projectName: projectInfo.projectName,
        tag: projectInfo.tag,
        description: projectInfo.description
    }
  })

  if(res.data.status === 'OK'){
    const resUsers = await projectService.findAllUserId(projectId)
                
    if(resUsers.data.status === 'OK' && resUsers.data.data.users.length > 0){
      const resNotif = await notificationService.addNewNotification({
        type: notifConfig.notifType.update,
        subject: notifConfig.notifSubject.project,
        content: `${localStorage.getItem('Username')} has changed project ${resUsers.data.data.projectName}'s information`,
        receiverId: resUsers.data.data.users
        })
        if(resNotif.data.status !== 'OK'){
          alert('Failed to notify')
        }}
  }

  return res
}

const deleteProject = async(projectId, deleteSentence) => {

  const res = await axios.delete(`${api.url}/api/project/${projectId}`, {
    headers: {
      'x-access-token': localStorage.getItem('X-Auth-Token')
    },
    data: {
      deleteSentence: deleteSentence
    }
  })

  if(res.data.status === 'OK'){
    const resUsers = await projectService.findAllUserId(projectId)
                
    if(resUsers.data.status === 'OK' && resUsers.data.data.users.length > 0){
      const resNotif = await notificationService.addNewNotification({
        type: notifConfig.notifType.delete,
        subject: notifConfig.notifSubject.project,
        content: `${localStorage.getItem('Username')} deleted project ${resUsers.data.data.projectName}'s information`,
        receiverId: resUsers.data.data.users
        })
        if(resNotif.data.status !== 'OK'){
          alert('Failed to notify')
        }}
  }
 
  return res
}

const searchProject = async (projectName, searchType, page) => {

  const res = await axios({
    method: 'post',
    url: `${api.url}/api/project/search`,
    headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
    }, 
    params: {
        projectName: projectName,
        type: searchType,
        page: page
    }
  })

  return res
}

const addUsersToProject = async(username, projectId) => {
  const res = await axios({
    method: 'post',
    url: `${api.url}/api/project/addUser`,
    headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
    }, 
    data: {
        username: username,
        projectId: projectId,
    }
  })

  if(res.data.status === 'OK'){
    // try {
      const resUsers = await projectService.findAllUserId(projectId)
                
    if(resUsers.data.status === 'OK' && resUsers.data.data.users.length > 0){
      const resNotif = await notificationService.addNewNotification({
        type: notifConfig.notifType.update,
        subject: notifConfig.notifSubject.project,
        content: `${localStorage.getItem('Username')} just add YOU to project ${resUsers.data.data.projectName}`,
        receiverId: resUsers.data.data.users
        })
        if(resNotif.data.status !== 'OK'){
          alert('Failed to notify')
        }}
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return res
}

const getWorkingProjects = async(page, keyWordWorking) => {
  const res = await axios({
    method: 'get',
    url: `${api.url}/api/project/working/invite`,
    headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
    },
    params: {
      page: page,
      search: keyWordWorking
    }
  })

  return res
}

const findAllUserId = async(projectId) => {
  const res = await axios({
    method: 'get',
    url: `${api.url}/api/project/${projectId}/users`,
    headers: {
        'x-access-token': localStorage.getItem('X-Auth-Token')
    }
  })

  return res
}

const projectService = {
    getUserProjects,
    getOneUserProject,
    createProject,
    changeProjectName,
    deleteProject,
    searchProject,
    addUsersToProject,
    getWorkingProjects,
    findAllUserId
}

export default projectService