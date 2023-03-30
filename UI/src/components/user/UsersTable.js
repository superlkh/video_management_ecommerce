import React, { lazy, useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
    CCard,
    CInputGroup,
    CPagination,
    CProgress,
    CInput,
    CInputGroupAppend,
    CButton,
    CModalHeader,
    CModalFooter,
    CModal,
    CModalBody,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CDropdownDivider
} from '@coreui/react'

import userServices from 'src/services/user.service'

const UsersTable = () => {

    const [keyWord, setKeyWord] = useState('')
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [countPages, setCountPages] = useState(1)
    const [hidePage, setHidePage] = useState(false)

    const [targetUserId, setTargetUserId] = useState(0)
    const [modalDelete, setModalDelete] = useState(false)
    const [modalActivate, setModalActivate] = useState(false)

    useEffect(async () => {
        await userServices.updateUserStorage()
        await getUsersInfo(currentPage)
    }, [])

    const getUsersInfo = async(page, keyWord) => {
        const res = await userServices.getUsersInfo(page, keyWord)
        if (res.data.status === 'OK' && res.data.data.count > 0) {
            if (parseInt(res.data.data.count) % 5 !== 0) {
                setCountPages(Math.round(parseInt(res.data.data.count) / 5 + 0.5))
            } else {
                setCountPages(Math.round(parseInt(res.data.data.count) / 5))
            }
            setUsers([...res.data.data.rows])

            if(res.data.data.count > 5){
                setHidePage(false)
            } else {
                setHidePage(true)
            }
        }
    }

    const softDeleteUser = async(userId, status) => {
        const res = await userServices.softDeleteUser(userId, status)
        if(res.data.status === 'OK'){
            await getUsersInfo(currentPage, keyWord)
            setModalDelete(false)
            setModalActivate(false)
        } else {
            alert('Failed')
        }
        
    }

    const pageChange = async (i) => {
        setCurrentPage(i)
        await userServices.updateUserStorage()
        await getUsersInfo(i, keyWord)
    }

    if (users.length === 0) {
        return null
    }
    return (
        <>
        <CInputGroup>
            <CInput placeholder="Find project by name..." onChange={async(e) => {
                setKeyWord(e.target.value)
                setCurrentPage(1)
                await getUsersInfo(1, e.target.value)
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
                        <th className="text-center"><CIcon name="cil-people" /></th>
                        <th>User</th>
                        <th className="text-center">Country</th>
                        <th>Usage</th>
                        <th className="text-center">Payment Method</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => {
                        // console.log('memory:',Math.round(user.memory/1000))
                        
                        let activateStatus = true
                        
                        if(user.deleted){
                            activateStatus = false
                        }

                        return (
                            <tr key={i}>
                                <td className="text-center">
                                    <div className="c-avatar">
                                        <img src={'avatars/1.jpg'} className="c-avatar-img" alt="admin@bootstrapmaster.com" />
                                        <span className="c-avatar-status bg-success"></span>
                                    </div>
                                </td>
                                <td>
                                    <div>{user.username}</div>
                                    <div className="small text-muted">
                                        {/* <span>New</span> |*/} Registered: {user.createdAt}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <CIcon height={25} name="cif-vn" title="vn" id="vn" />
                                </td>
                                <td>
                                    <div className="clearfix">
                                        <div className="float-left">
                                            <strong>{(Math.round(user.memory/100))/100}%</strong>
                                        </div>
                                        <div className="float-right">
                                            <small className="text-muted">Jun 11, 2015 - Jul 10, 2015</small>
                                        </div>
                                    </div>
                                    <CProgress className="progress-xs" color="success" value={(Math.round(user.memory/100))/100} />
                                </td>
                                <td className="text-center">
                                    <CIcon height={25} name="cib-cc-mastercard" />
                                </td>
                                <td className="text-center">
                                <CDropdown className="m-1">
                                    <CDropdownToggle>
                                    Action
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {/* <CDropdownItem header>Header</CDropdownItem> */}
                                        <CDropdownItem disabled = {activateStatus} onClick={async() => {
                                            setTargetUserId(user.id)
                                            setModalActivate(true)
                                        }}>Activate</CDropdownItem>
                                        <CDropdownDivider />
                                        <CDropdownItem disabled = {!activateStatus} onClick={async() => {
                                            setTargetUserId(user.id)
                                            setModalDelete(true)
                                        }}>Soft Delete</CDropdownItem>
                                    </CDropdownMenu>
                                </CDropdown>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </CCard>
            <CPagination
                hidden={hidePage}
                activePage={currentPage}
                pages={countPages}
                onActivePageChange={pageChange}
            ></CPagination>
            <CModal show={modalDelete} centered>
                <CModalHeader>
                    <b>Soft Delete User</b> 
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to soft delete this user?
                </CModalBody>
                <CModalFooter>
                <CButton color="danger" onClick={async() => {
                    await softDeleteUser(targetUserId, true)
                }}>Yes</CButton>
                <CButton color='primary' onClick={() => setModalDelete(false)}>No</CButton>
                </CModalFooter>
            </CModal>
            <CModal show={modalActivate} centered>
                <CModalHeader>
                    <b>Activate User</b> 
                </CModalHeader>
                <CModalBody>
                    Activate this user?
                </CModalBody>
                <CModalFooter>
                <CButton color="primary" onClick={async() => {
                    await softDeleteUser(targetUserId, false)
                    
                }}>Yes</CButton>
                <CButton color='secondary' onClick={() => setModalActivate(false)}>No</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default UsersTable