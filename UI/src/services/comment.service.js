import axios from 'axios'
import api from 'src/config/api.config'
import projectService from './project.service'
import notificationService from './notification.service'
import notifType from '../config/notification.config'


const getVideoComments = async(videoId, page) => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/comments/${videoId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }, 
        params: {
            page: page
        }
      })
    
    return res
}

const getChildComments = async(videoId, commentId) => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/childComment/${videoId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }, 
        params: {
            commentId: commentId
        }
      })
    
    return res
}

const commentVideo = async(info) => {  
    const res = await axios({
        method: 'post',
        url: `${api.url}/api/comments/${info.videoId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }, 
        data: {
            projectId: info.projectId,
            folderId: info.folderId,
            comment: info.comment,
            commentParentId: info.commentParentId
        },
      })
    
      if(res.data.status === 'OK'){
        const resUsers = await projectService.findAllUserId(info.projectId)
                    
        if(resUsers.data.status === 'OK' && resUsers.data.data.users.length > 0){
          const resNotif = await notificationService.addNewNotification({
            type: notifType.video,
            content: `${localStorage.getItem('Username')} commented on a video of project ${resUsers.data.data.projectName}`,
            receiverId: resUsers.data.data.users
            })
            if(resNotif.data.status !== 'OK'){
              alert('Failed to notify')
            }}
      }
    
    return res
}

const deleteComment = async(commentId) => {
    const res = await axios({
        method: 'delete',
        url: `${api.url}/api/comments/${commentId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        }
      })
    
    return res
}

const updateComment = async(commentId, newComment) => {
    const res = await axios({
        method: 'put',
        url: `${api.url}/api/comments/${commentId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        data: {
            newComment: newComment
        }
      })
    
    return res
}

const commentServices = {
    getVideoComments,
    getChildComments,
    commentVideo,
    deleteComment,
    updateComment
}

export default commentServices