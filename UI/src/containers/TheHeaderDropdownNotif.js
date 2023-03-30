import React, {useState, useEffect} from 'react'
import {
  CBadge,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CPagination,
  CProgress,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import notificationService from 'src/services/notification.service'
import notifConfig from 'src/config/notification.config'
import PubSub from 'pubsub-js'

const TheHeaderDropdownNotif = () => {
  // const itemsCount = 5
  const [notifications, setNotifications] = useState([])
  const [totalNotifs, setTotalNotifs] = useState(0)
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [countPages, setCountPages] = useState(1)
  const [hidePagination, setHidePagination] = useState(true)
  
  useEffect(async() => {
    await getNotifications(currentPage)
  }, [])
  if(unreadNotifs === 0){
    setUnreadNotifs(null)
  }
  const getNotifications = async(page) => {
    const res = await notificationService.getNotifications(page)
    if(res.data.status === 'OK'){
      if(res.data.data.count === '0'){
        setNotifications('No notifications')
      } else {
        setTotalNotifs(parseInt(res.data.data.count))
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

        setUnreadNotifs(parseInt(res.data.data.unreadCount))
        setNotifications([...res.data.data.rows])
      }
    }
  }

  const pageChange = async(i) => {
    setCurrentPage(i)
    await getNotifications(i)
  }
  
  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell"/>
        <CBadge shape="pill" color="danger">{unreadNotifs}</CBadge>
      </CDropdownToggle>
      <CDropdownMenu  placement="bottom-end" className="pt-0">
        <CDropdownItem
          header
          tag="div"
          className="text-center"
          color="light"
        >
          <strong>You have {totalNotifs} notifications</strong>
        </CDropdownItem>
        {notifications.map((notif, i) => {
          let icon = ''
          let textColor = ''
      
          if(parseInt(notif.type) === notifConfig.notifType.create){
            textColor= "mr-2 text-success"
          } else if (parseInt(notif.type) === notifConfig.notifType.read){
            textColor = "mr-2 text-primary"
          } else if (parseInt(notif.type) === notifConfig.notifType.update){
            textColor = "mr-2 text-info"
          } else if (parseInt(notif.type) === notifConfig.notifType.delete){
            textColor = "mr-2 text-danger"
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
        if(notif.status === false){
          return(
            <CDropdownItem key={i} onClick={async() => {
              const res = await notificationService.changeStatus(notif.id)
              if(res.data.status === 'OK'){
                await getNotifications(currentPage)
              }
            }}>
              <CIcon name={icon} className={textColor} />
              {notif.content}
              </CDropdownItem>
          )
        }
          return(
            <CDropdownItem color='secondary' key={i} onClick={async() => {
              const res = await notificationService.changeStatus(notif.id)
              if(res.data.status === 'OK'){
                await getNotifications(currentPage)
              }
            }}>
              <CIcon name={icon} className={textColor} />
              {notif.content}
              </CDropdownItem>
          )
        })}
        {/* <CDropdownItem onClick={() => {
          console.log('Clicked')
        }}><CIcon name="cil-user-follow" className="mr-2 text-success" /> New user registered</CDropdownItem>
        <CDropdownItem><CIcon name="cil-user-unfollow" className="mr-2 text-danger" /> User deleted</CDropdownItem>
        <CDropdownItem><CIcon name="cil-chart-pie" className="mr-2 text-info" /> Sales report is ready</CDropdownItem>
        <CDropdownItem><CIcon name="cil-basket" className="mr-2 text-primary" /> New client</CDropdownItem>
        <CDropdownItem><CIcon name="cil-speedometer" className="mr-2 text-warning" /> Server overloaded</CDropdownItem> */}
        {/* <CContainer>
        <CRow className="justify-content-center">
          <CPagination
            activePage={currentPage}
            pages={countPages}
            onActivePageChange={pageChange}
          ></CPagination>
        </CRow>
        </CContainer> */}
         <CContainer>
        <CRow className="justify-content-center">
          <CPagination
            hidden={hidePagination}
            activePage={currentPage}
            pages={countPages}
            onActivePageChange={pageChange}
          ></CPagination>
        </CRow>
        </CContainer>

        {/* <CDropdownItem
          header
          tag="div"
          color="light"
        >
          <strong>Server</strong>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>CPU Usage</b></small>
          </div>
          <CProgress size="xs" color="info" value={25} />
          <small className="text-muted">348 Processes. 1/4 Cores.</small>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>Memory Usage</b></small>
          </div>
          <CProgress size="xs" color="warning" value={70} />
          <small className="text-muted">11444GB/16384MB</small>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>SSD 1 Usage</b></small>
          </div>
          <CProgress size="xs" color="danger" value={90} />
          <small className="text-muted">243GB/256GB</small>
        </CDropdownItem> */}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownNotif