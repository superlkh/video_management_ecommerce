import React, { lazy, useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
    CInput,
    CInputGroup,
    CInputGroupAppend,
    CPagination,
    CProgress,
    CCard,
    CButton,

  } from '@coreui/react'

import notificationService from 'src/services/notification.service'
import notifConfig from 'src/config/notification.config'

const Notification = () => {
    const [keyWord, setKeyWord] = useState('')
    const [notifications, setNotifications] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [countPages, setCountPages] = useState(1)
    const [hidePagination, setHidePagination] = useState(true)

    useEffect(async() => {
        await getNotifications(currentPage)
      }, [])

    const getNotifications = async(page, keyWord) => {
        const res = await notificationService.getNotifications(page, keyWord)
        if(res.data.status === 'OK'){
          if(res.data.data.count === '0'){
            setNotifications('No notifications')
          } else {
            // setTotalNotifs(parseInt(res.data.data.count))
            if(parseInt(res.data.data.count) % 10 !== 0){
              setCountPages(Math.round(parseInt(res.data.data.count) / 10 + 0.5))
            } else {
              setCountPages(Math.round(parseInt(res.data.data.count) / 10))
            }
    
            if(parseInt(res.data.data.count) > 10){
              setHidePagination(false)
            } else {
              setHidePagination(true)
            }
    
            // setUnreadNotifs(parseInt(res.data.data.unreadCount))
            setNotifications([...res.data.data.rows])
          }
        }
    }

    const pageChange = async(i) => {
        setCurrentPage(i)
        await getNotifications(i, keyWord)
    }

    return(
        <>
        <CInputGroup>
            <CInput placeholder="Find notifications by content..." onChange={async(e) => {
                setKeyWord(e.target.value)
                setCurrentPage(1)
                await getNotifications(1, e.target.value)
            }}></CInput>
            <CInputGroupAppend>
                <CButton color="primary">
                    <CIcon name="cil-magnifying-glass" />
                </CButton>
            </CInputGroupAppend>
        </CInputGroup>
        <br/>
        <CCard>
            <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                    <tr>
                        <th className="text-center">Type</th>
                        <th className="text-center">Subject</th>
                        <th className="text-center">Content</th>
                        <th className="text-center">Is Read</th>
                        <th className="text-center">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notif, i) => {
                        let notifType = ''
                        let notifTypeColor = ''
                        let icon = ''
                        let isReadIcon = <CIcon name="cil-x" className='text-danger'/>
                        if(parseInt(notif.type) === notifConfig.notifType.create){
                            notifType = 'Create'
                            notifTypeColor = 'mr-2 text-success'
                        } else if(parseInt(notif.type) === notifConfig.notifType.read){
                            notifType = 'Read'
                            notifTypeColor = 'mr-2 text-primary'
                        } else if(parseInt(notif.type) === notifConfig.notifType.update){
                            notifType = 'Update'
                            notifTypeColor = 'mr-2 text-info'
                        } else if(parseInt(notif.type) === notifConfig.notifType.delete){
                            notifType = 'Delete'
                            notifTypeColor = 'mr-2 text-danger'
                        } else if(parseInt(notif.type) === notifConfig.notifType.warning){
                            notifType ='Warning'
                            notifTypeColor = 'mr-2 text-warning'
                        }

                        if (parseInt(notif.subject) === notifConfig.notifSubject.user){
                            icon = 'cil-user'
                        } else if (parseInt(notif.subject) === notifConfig.notifSubject.video){
                            icon = 'cil-video'
                        } else if (parseInt(notif.subject) === notifConfig.notifSubject.project){
                            icon = 'cil-window-restore'
                        } else if (parseInt(notif.subject) === notifConfig.notifSubject.image){
                            icon = 'cil-image'
                        } else if (parseInt(notif.subject) === notifConfig.notifSubject.folder){
                            icon = 'cil-folder'
                        }

                        if (notif.status){
                            isReadIcon = <CIcon name="cil-check" className='text-success'/>
                        }
                        return (
                            <tr key={i}>
                                <td className="text-center">
                                    <div className={notifTypeColor}>
                                        {notifType}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <CIcon name={icon}></CIcon>
                                </td>
                                <td className="text-center">
                                    {notif.content}
                                </td>
                                <td className="text-center">
                                    {isReadIcon}
                                </td>
                                <td className="text-center">
                                    {notif.createdAt}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </CCard>
            <CPagination
                hidden={hidePagination}
                activePage={currentPage}
                pages={countPages}
                onActivePageChange={pageChange}
            ></CPagination>
        </>
    )
}

export default Notification