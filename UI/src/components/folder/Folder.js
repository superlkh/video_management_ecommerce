import React, { useEffect, useState } from 'react'

import CIcon from '@coreui/icons-react'
import {
    CCol,
    CCard,
    CCardBody,
    CRow,
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
    CAlert,
    CPagination
} from '@coreui/react'

import { folderService } from 'src/services/folder.service'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import FolderCard from './FolderCard'


const Folder = (props) => {


    const projectId = props.match.params.projectId
    const parentId = null
    const folderPageSize = process.env.REACT_APP_PAGE_SIZE_FOLDER
    const history = useHistory()

    // biến để load lại page
    const [loadPage, setLoadPage] = useState(true)

    // các state của folder
    const [folderNameCreate, setFolderNameCreate] = useState('')
    const [listFolder, setListFolder] = useState([])
    const [modalInsert, setModalInsert] = useState(false)
    const [countPages, setCountPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [hidePageFolder, setHidePageFolder] = useState(false)

    // modal thong bao name folder da ton tai
    const [modalFolderNameExist, setModalFolderNameExist] = useState(false)
    // folder name đã tồn tại = 1, chứa kí tự đặc biệt = 2, khởi tạo = 0
    const [folderNameIsValid, setFolderNameIsValid] = useState(0)



    const token = localStorage.getItem('X-Auth-Token')

    const loadFolders = async (curPage) => {
        const onHandle = {
            onCreate: createFolder,
            onUpdate: updateFolder,
            onDelete: deleteFolder,
            onNavigateFolderDetail: navigateToFolderDetail,
            onLoadPage: setLoadPage
        }
        const properties = {
            projectId,
            loadPage
        }
        const response = await folderService.getFolders(parentId, projectId, curPage, folderPageSize)
        setListFolder(response.data.listFolder.map(folder => {
            return (<FolderCard key={folder.id} folderInfo={folder} onFunction={onHandle} properties={properties}></FolderCard>)
        }))
        setCountPages(Math.ceil(response.data.count / folderPageSize))
        if (Math.ceil(response.data.count / folderPageSize) < 2) {
            setHidePageFolder(true)
        } else {
            setHidePageFolder(false)
        }
    }

    useEffect(async () => {
        if (token) {
            loadFolders(currentPage)
        }

    }, [folderPageSize, loadPage])


    if (!token) {
        return (<div>
            <CAlert color="danger">Please log in to use this feature</CAlert>
        </div>)
    }

    const toggleModalInsert = () => {
        setModalInsert(!modalInsert)
        setFolderNameCreate('')
        setFolderNameIsValid(0)
    }

    // const toggleModalFolderNameExist = () => {
    //     setModalFolderNameExist(!modalFolderNameExist)
    // }

    const pageFolderChange = async (i) => {
        setCurrentPage(i)
        loadFolders(i)
    }

    const createFolder = async () => {
        const responseCre = await folderService.createFolder(projectId, folderNameCreate)
        if (responseCre.status === 'OK') {
            setFolderNameCreate('')
            toggleModalInsert()
            loadFolders(currentPage)
        } else if (responseCre.status === 'REQUEST_DENIED') {
            setFolderNameIsValid(1)
        } else if (responseCre.status === 'INVALID_REQUEST') {
            setFolderNameIsValid(2)
        } else {
            alert('There is some errors')
        }
    }

    const deleteFolder = async (folder) => {
        const responseDel = await folderService.deleteFolder(folder.id)
        if (responseDel.status === 'OK') {
            loadFolders(currentPage)
        }
    }

    const updateFolder = async (folder, newName) => {
        const responseUp = await folderService.updateFolder(folder.id, newName)
        if (responseUp.status === 'OK' && responseUp.data) {
            loadFolders(currentPage)
        } else if (responseUp.status === 'REQUEST_DENIED') {
            setFolderNameIsValid(1)
        } else if (responseUp.status === 'INVALID_REQUEST') {
            setFolderNameIsValid(2)
        } else {
            alert('There is some errors')
        }
    }

    const navigateToFolderDetail = (folder) => {
        history.push({
            pathname: `/projectDetail/${projectId}/folderDetail/${folder.id}`,

        })
        setCurrentPage(1)
    }



    return (
        <>
            <CRow>
                <CCol>
                    <CCard >
                        <CCardBody className="bg-success">
                            <CButton size="xl" className="btn-facebook btn-brand mr-1 mb-1" onClick={() => setModalInsert(!modalInsert)}>
                                <CIcon size="xl" name="cilLibraryAdd" /><span className="mfs-2">Create folder</span>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Modal Insert */}
            <CModal show={modalInsert} onClose={toggleModalInsert} centered>
                <CModalBody>

                    <CCard>
                        <CCardHeader>
                            Create folder
                        </CCardHeader>
                        <CCardBody>
                            <CForm action="" method="post" className="form-horizontal">
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="hf-email">Folder name</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CInput type="text" value={folderNameCreate} onChange={(e) => { setFolderNameCreate(e.target.value) }} />
                                    </CCol>
                                </CFormGroup>
                                {folderNameIsValid === 0 ? '' : (folderNameIsValid === 1 ?
                                    <CAlert className='mt-2 mb-3' color="danger">Folder name existed</CAlert> :
                                    <CAlert className='mt-2 mb-3' color="danger">Folder name can not include specialvalue</CAlert>)}
                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton size="sm" color="primary" onClick={createFolder}>Create</CButton> {'   '}
                            <CButton size="sm" color="danger" onClick={toggleModalInsert}>Cancel</CButton>
                        </CCardFooter>
                    </CCard>

                </CModalBody>
            </CModal>

            {/* Modal thong bao folder name ton tai */}
            {/* <CModal show={modalFolderNameExist} onClose={toggleModalFolderNameExist} centered>
                <CModalBody>
                    <CCard>
                        <CCardBody>
                            <h5>Folder name has existed</h5>
                        </CCardBody>
                        <CCardFooter>
                            <CButton size="sm" color="primary" onClick={toggleModalFolderNameExist}>OK</CButton>
                        </CCardFooter>
                    </CCard>
                </CModalBody>
            </CModal> */}

            <h2>Folder</h2>

            <CRow>{listFolder}</CRow>

            <CPagination
                hidden={hidePageFolder}
                activePage={currentPage}
                pages={countPages}
                onActivePageChange={pageFolderChange}
            ></CPagination>
        </>
    )
}

export default Folder