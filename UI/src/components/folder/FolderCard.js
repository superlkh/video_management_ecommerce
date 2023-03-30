import React, { useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
    CCol,
    CCard,
    CCardBody,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
    CInput,
    CCardHeader,
    CForm,
    CFormGroup,
    CLabel,
    CCardFooter,
    CAlert
} from '@coreui/react'
import { folderService } from '../../services/folder.service'



const FolderCard = (props) => {
    const { folderInfo, onFunction, properties } = props

    // modal update, delete
    const [modalDelete, setModalDelete] = useState(false)
    const [modalUpdate, setModalUpdate] = useState(false)
    // tên khi rename folder
    const [newName, setNewName] = useState('')
    // check tên folder tồn tại = 1 hay chứa kí tự đặc biệt = 2, khởi tạo = 0
    const [folderNameIsValid, setFolderNameIsValid] = useState(0)

    const toggleModalDelete = () => {
        setModalDelete(!modalDelete)
    }

    const toggleModalUpdate = () => {
        setModalUpdate(!modalUpdate)
    }

    const handleDelete = () => {
        onFunction.onDelete(folderInfo)
        toggleModalDelete()
    }

    // const handleUpdate = () => {
    //     onFunction.onUpdate(folderInfo, newName)
    //     toggleModalUpdate()
    //     onFunction.onLoadPage(properties.loadPage)
    // }

    const handleUpdate = async () => {
        const responseUp = await folderService.updateFolder(folderInfo.id, newName)
        if (responseUp.status === 'OK' && responseUp.data) {
            toggleModalUpdate()
            onFunction.onLoadPage(!properties.loadPage)
        } else if (responseUp.status === 'REQUEST_DENIED') {
            setFolderNameIsValid(1)
        } else if (responseUp.status === 'INVALID_REQUEST') {
            setFolderNameIsValid(2)
        } else {
            alert('There is some errors')
        }
    }

    return (
        <CCol xs="12" sm="6" md="3" >
            <CCard style={{ borderRadius: '15px', backgroundColor: '#fd0' }}>
                <CCardBody className="c-sidebar-nav-dropdown" style={{ padding: '5px' }} onDoubleClick={() => onFunction.onNavigateFolderDetail(folderInfo)}>
                    <CIcon className="m-1 card-header-actions" style={{ float: 'left' }} name="cilFolder" size="xl" />
                    <span className="m-1 card-header-actions" style={{ marginLeft: "10px", float: 'left' }}>{folderInfo.folderName}</span>
                    <CDropdown className="m-1 card-header-actions" size="xl">
                        <CDropdownToggle />
                        <CDropdownMenu>
                            <CDropdownItem onClick={toggleModalDelete}>Delete</CDropdownItem>
                            <CDropdownItem onClick={toggleModalUpdate}>Rename</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>


                    {/* Modal delete */}

                    <CModal show={modalDelete} onClose={toggleModalDelete} centered>
                        <CModalBody>
                            Are you sure to delete {folderInfo.folderName} ?
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="primary" onClick={handleDelete}>Delete</CButton>{' '}
                            <CButton color="secondary" onClick={toggleModalDelete}>Cancel</CButton>
                        </CModalFooter>
                    </CModal>


                    {/* Modal update */}
                    <CModal show={modalUpdate} onClose={toggleModalUpdate} centered onDoubleClick={(e) => { e.stopPropagation() }}>
                        <CModalBody>

                            <CCard>
                                <CCardHeader>
                                    Rename folder
                                </CCardHeader>
                                <CCardBody>
                                    <CForm action="" method="post" className="form-horizontal">
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel htmlFor="hf-email">New name</CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CInput type="text" defaultValue={folderInfo.folderName}
                                                    onChange={(e) => { setNewName(e.target.value) }} />
                                            </CCol>
                                        </CFormGroup>
                                        {folderNameIsValid === 0 ? '' : (folderNameIsValid === 1 ?
                                            <CAlert className='mt-2 mb-3' color="danger">Folder name existed</CAlert> :
                                            <CAlert className='mt-2 mb-3' color="danger">Folder name can not include specialvalue</CAlert>)}
                                    </CForm>
                                </CCardBody>
                                <CCardFooter>
                                    <CButton type="submit" size="sm" color="primary" onClick={handleUpdate}>Rename</CButton> {'   '}
                                    <CButton type="reset" size="sm" color="danger"
                                        onClick={toggleModalUpdate}>Cancel</CButton>
                                </CCardFooter>
                            </CCard>

                        </CModalBody>
                    </CModal>

                </CCardBody>
            </CCard>
        </CCol>
    )
}

export default FolderCard
