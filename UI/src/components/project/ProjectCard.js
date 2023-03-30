import React, { useState, useEffect } from 'react'
import projectService from 'src/services/project.service'
import userServices from 'src/services/user.service'
import { useHistory } from 'react-router'
import {
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CInput,
  CAlert,
  CCard,
  CCardImg,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CPagination,
  CLabel
} from '@coreui/react'

const ProjectCard = ({ projectInfo }) => {
  // Set state cho project
  const [project, setProject] = useState(projectInfo)
  // Tên của project được truyền vào
  const [projectName, setProjectName] = useState(projectInfo.projectName)
  // Alert thông báo tên project không hợp lệ
  const [invalidProjectName, setInvalidProjectName] = useState(null)
  // Alert thông báo delete không hợp lệ
  const [invalidDelete, setInvalidDelete] = useState(null)
  // Set state cho CModal đổi tên project
  const [modalProjectName, setModalProjectName] = useState(false)
  // Set state cho CModal xóa project
  const [modalDelete, setModalDelete] = useState(false)
  // Tên mới của project
  const [newProjectName, setNewProjectName] = useState('')
  // Câu "Delete"
  const [deleteSentence, setDeleteSentence] = useState('')

  // // KHAI BÁO: thêm user vào project
  // // Set state cho CModal thêm user vào project
  const [modalAddUsers, setModalAddUsers] = useState(false)
  const [users, setUsers] = useState()
  const [addResult, setAddResult] = useState()
  // Set state cho tìm kiếm user
  const [queryUser, setQueryUser] = useState('')
  // Set state cho pagination tìm user
  const [currentPageUser, setCurrentPageUser] = useState(1)
  const [countPagesUser, setCountPagesUser] = useState(1)

  useEffect(() => {
    console.log('Hello Rerendered')

  }, [])

  const history = useHistory()

  const toggleDelete = () => {
    setModalDelete(!modalDelete);
  }

  const deleteProject = () => {

    const res = projectService.deleteProject(projectInfo.id, deleteSentence)

    res.then(data => {
      if (data.data.status !== 'OK') {
        setInvalidDelete(<CAlert color="danger">Invalid delete</CAlert>)
      } else {
        toggleDelete()
        setProject(null)
      }
    })

  }

  const handleDoubleClick = () => {
    history.push({
      pathname: `/projectDetail/${projectInfo.id}/folder`
    })
  }

  // CHỨC NĂNG: Thêm user vào proejct
  // Bật modal thêm user vào project
  const toggleAddUsers = async () => {
    setModalAddUsers(!modalAddUsers)
    setAddResult(null)
  }
  // Tìm user chưa tham gia vào project
  const searchUsers = async (e) => {
    setQueryUser(e.target.value)
    const res = await userServices.searchUsers(e.target.value, projectInfo.id, currentPageUser)

    if (res.data.status === "OK" && res.data.data.count > 0) {
      const userList = res.data.data.rows
      if (parseInt(res.data.data.count) % 5 !== 0) {
        setCountPagesUser(Math.round(parseInt(res.data.data.count) / 5 + 0.5))
      } else {
        setCountPagesUser(Math.round(parseInt(res.data.data.count) / 5))
      }
      setUsers(userList.map(user => {
        return (
          <CListGroupItem key={user.id} href="#">
            <CRow>
              <CCol xs="10">
                {user.username}
              </CCol>
              <CCol>
                <CButton color="primary" onClick={() => {
                  addUsersToProject(e.target.value, user.username, projectInfo.id)
                }}>Add</CButton>
              </CCol>
            </CRow>
          </CListGroupItem>
        )
      }))
    } else {
      setUsers(<CListGroupItem color="secondary">No User Found</CListGroupItem>)
    }
  }
  //Thêm user vào project
  const addUsersToProject = async (query, username, projectId) => {

    const result = await projectService.addUsersToProject(username, projectId)

    if (result.data.status === "OK") {
      setAddResult(<CAlert color="success">Add successfully</CAlert>)
      const res = await userServices.searchUsers(query, projectInfo.id, currentPageUser)
      const userList = res.data.data.rows
      if (parseInt(res.data.data.count) % 5 !== 0) {
        setCountPagesUser(Math.round(parseInt(res.data.data.count) / 5 + 0.5))
      } else {
        setCountPagesUser(Math.round(parseInt(res.data.data.count) / 5))
      }
      setUsers(userList.map(user => {
        if (!user) {
          return null
        }
        return (
          <CListGroupItem key={user.id} href="#">
            <CRow>
              <CCol xs="10">
                {user.username}
              </CCol>
              <CCol>
                <CButton color="primary" onClick={() => {
                  addUsersToProject(query, user.username, projectInfo.id)
                }}>Add</CButton>
              </CCol>
            </CRow>
          </CListGroupItem>
        )
      }))
    } else {
      setAddResult(<CAlert color="danger">Already invited or not allowed</CAlert>)
    }
  }

  const pageChangeUser = async (i) => {
    setCurrentPageUser(i)
    const list = await userServices.searchUsers(queryUser, projectInfo.id, i)
    if (list.data.data === null) {
      setUsers(<CListGroupItem color="secondary">No User Found</CListGroupItem>)
      return
    }
    const data = list.data.data.rows
    if (parseInt(list.data.data.count) % 5 !== 0) {
      setCountPagesUser(Math.round(parseInt(list.data.data.count) / 5 + 0.5))
    } else {
      setCountPagesUser(Math.round(parseInt(list.data.data.count) / 5))
    }
    setUsers(data.map(user => {
      return (
        <CListGroupItem key={user.id} href="#">
          <CRow>
            <CCol xs="10">
              {user.username}
            </CCol>
            <CCol>
              <CButton color="primary" onClick={() => {
                addUsersToProject(queryUser, user.username, projectInfo.id)
              }}>Add</CButton>
            </CCol>
          </CRow>
        </CListGroupItem>
      )
    }))

  }

  // HẾT CHỨC NĂNG: thêm user vào project



  // Nếu không có project thì return null
  if (!project) {
    return null
  }
  return (
    <CCol md="3">
      <CCard onDoubleClick={handleDoubleClick}>
        <CDropdown>
          <CDropdownToggle>
            <b>{projectName}</b>
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={toggleAddUsers}>Add Users to Project</CDropdownItem>
            <CDropdownItem divider />
            <CDropdownItem onClick={() => { history.push(`/project/${projectInfo.id}`) }}>Change Project Info</CDropdownItem>
            {/* <CDropdownItem onClick={toggleChangeName}>Change Project Name</CDropdownItem> */}
            <CDropdownItem divider />
            <CDropdownItem onClick={toggleDelete}>Delete</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <CCardImg src="https://tuoitredoisong.net/wp-content/uploads/2019/10/dich-Project-la-gi-trong-tieng-viet.jpg"></CCardImg>
        {/*Thêm user vào project  */}
        <CModal
          show={modalAddUsers}
          onClose={toggleAddUsers}
        >
          <CModalHeader closeButton>Add users to project</CModalHeader>
          <CModalBody>
            <CInput placeholder="Search users..." onChange={searchUsers}></CInput>
            <br />
            <CListGroup>
              {users}
            </CListGroup>
            <br />
            <CPagination
              activePage={currentPageUser}
              pages={countPagesUser}
              onActivePageChange={pageChangeUser}
            ></CPagination>
            <br />
            {addResult}
          </CModalBody>

          <CModalFooter>
            <CButton color="primary">Done</CButton>{' '}
            <CButton
              color="secondary"
              onClick={toggleAddUsers}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
        {/* Xóa Project */}
        <CModal
          show={modalDelete}
          onClose={toggleDelete}
        >
          <CModalHeader closeButton>Type "Delete" to delete the project</CModalHeader>
          <CModalBody>
            <CInput placeholder="Enter 'Delete'" onChange={((e) => setDeleteSentence(e.target.value))}></CInput>
          </CModalBody>
          {invalidDelete}
          <CModalFooter>
            <CButton color="danger" onClick={deleteProject}>Delete Project</CButton>{' '}
            <CButton
              color="secondary"
              onClick={toggleDelete}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </CCol>
  )
}

export default ProjectCard