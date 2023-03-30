import React, { useState } from 'react'
//import { google } from 'googleapis'
import api from 'src/config/api.config'
import imgService from 'src/services/image.service'
import {
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CRow,
    CCardImg,
    CInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
    CModalHeader,
    CTabContent,
    CTabPane,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CAlert,
    CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const API_URL = process.env.REACT_APP_API_URL

const ImageCard = (props) => {

    const { imageInfo, onFunction } = props

    // bieu tuong load khi remove bg, add tags, check nudity
    const [isLoadingImg, setIsLoadingImg] = useState(false)
    // cac modal cua ham chuc nang
    const [modalRemoveBg, setModalRemoveBg] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [modalChangeBg, setModalChangeBg] = useState(false)

    // change background
    const [colorChangeBg, setColorChangeBg] = useState('red')
    const [activeTab, setActiveTab] = useState(0)
    const [imgBg, setImgBg] = useState(null)

    // show tag
    const [modalShowTags, setModalShowTags] = useState(false)
    const [tagAddManual, setTagAddManual] = useState('')
    const [listTags, setListTags] = useState([])

    // modal hien thi ket qua check nudity
    const [modalShowCheckNudity, setModalShowCheckNudity] = useState(false)
    const [isNudity, setIsNudity] = useState(imageInfo.nudity)

    // modal hien thi ket qua upload len cloudinary
    const [modalUploadCloudinary, setModalUploadCloudinary] = useState(false)
    const [resultUploadCloudinary, setResultUploadCloudinary] = useState(null)

    // modal hien thi ket qua upload len google drive
    const [modalUploadGoogleDrive, setModalUploadGoogleDrive] = useState(false)
    const [resultUploadGoogleDrive, setResultUploadGoogleDrive] = useState(null)

    // ___________________________________________________________________________

    const deleteImg = async () => {
        const res = await imgService.deleteImg(imageInfo.id)
        if (res.data.status === 'OK') {
            onFunction.onReload()
            toggleModalDelete()
        }
    }

    const removeBg = async () => {
        setModalRemoveBg(!modalRemoveBg)
        setIsLoadingImg(preState => !preState)
        const res = await imgService.removeBg(imageInfo.id)
        if (res.data.status === 'OK') {
            setIsLoadingImg(preState => !preState)
            onFunction.onReload()
        }
    }

    const handleChangeBgColor = (e) => {
        setColorChangeBg(e.target.value)
        console.log('change')
        //colorChangeBg = e.target.value
    }

    const changeBg = async () => {
        if (activeTab === 0) {
            setModalChangeBg(!modalChangeBg)
            setIsLoadingImg(preState => !preState)
            const res = await imgService.changeBgColor(colorChangeBg, imageInfo.path)
            if (res.data.status === 'OK') {
                setIsLoadingImg(preState => !preState)
                onFunction.onReload()
            }
        } else if (activeTab === 1) {
            const formData = new FormData()
            formData.append('image', imgBg[0])
            formData.append('path', imageInfo.path)
            setModalChangeBg(!modalChangeBg)
            setIsLoadingImg(preState => !preState)
            const res = await imgService.changeBgImg(formData)
            if (res.data.status === 'OK') {
                setIsLoadingImg(preState => !preState)
                onFunction.onReload()
            }
        }
    }

    // show tag
    const showTag = async () => {
        const res = await imgService.getTagImage(imageInfo.id)
        if (res.data.status === 'OK') {
            setListTags(res.data.data.tags)
            toggleModalShowTags()
        }
    }

    const autoTagging = async () => {
        setIsLoadingImg(preState => !preState)
        const res = await imgService.autoTagging(imageInfo.id)
        if (res.data.status === 'OK') {
            setIsLoadingImg(preState => !preState)
            setListTags(res.data.data.tags)
        }
    }

    const deleteTag = async (tag) => {
        const res = await imgService.deleteTag(imageInfo.id, tag)
        if (res.data.status === 'OK') {
            const res = await imgService.getTagImage(imageInfo.id)
            if (res.data.status === 'OK') {
                setListTags(res.data.data.tags)
            }
        }
    }

    const addTagManual = async () => {
        const res = await imgService.addTagManual(imageInfo.id, tagAddManual)
        if (res.data.status === 'OK') {
            const res = await imgService.getTagImage(imageInfo.id)
            if (res.data.status === 'OK') {
                setListTags(res.data.data.tags)
            }
            setTagAddManual('')
        }
    }

    // check nudity
    const checkNudity = async () => {
        setIsLoadingImg(preState => !preState)
        const res = await imgService.checkNudity(imageInfo.path)
        if (res.data.status === 'OK') {
            setIsLoadingImg(preState => !preState)
            toggleModalShowCheckNudity()
            setIsNudity(res.data.data.isNudity)
        }
    }

    // upload cloudinary
    const uploadCloudinary = async () => {
        setIsLoadingImg(preState => !preState)
        const res = await imgService.uploadCloudinary(imageInfo.path)
        if (res.data.status === 'OK') {
            setIsLoadingImg(preState => !preState)
            // =1: upload thanh cong, =-1 chua connect cloudinary
            setResultUploadCloudinary(1)
            toggleModalUploadCloudinary()
        } else if ((res.data.status === 'REQUEST_DENIED')) {
            setIsLoadingImg(preState => !preState)
            // =1: upload thanh cong, =-1 chua connect cloudinary
            setResultUploadCloudinary(-1)
            toggleModalUploadCloudinary()
        }
    }

    // upload google drive
    const uploadGoogleDrive = async () => {
        setIsLoadingImg(preState => !preState)
        const res = await imgService.uploadGoogleDrive(imageInfo.path)
        if (res.data.status === 'REQUEST_DENIED') {
            setIsLoadingImg(preState => !preState)
            setResultUploadGoogleDrive(0)
            toggleModalUploadGoogleDrive(!modalUploadGoogleDrive)
        } else if (res.data.status === 'OK') {
            setIsLoadingImg(preState => !preState)
            setResultUploadGoogleDrive(1)
            toggleModalUploadGoogleDrive(!modalUploadGoogleDrive)
        }
    }

    // toggle modal
    const toggleModalDelete = () => {
        setModalDelete(!modalDelete)
    }

    const toggleModalRemoveBg = () => {
        setModalRemoveBg(!modalRemoveBg)
    }

    const toggleModalChangeBg = () => {
        setModalChangeBg(!modalChangeBg)
    }

    const toggleModalShowTags = () => {
        setModalShowTags(!modalShowTags)
    }

    const toggleModalShowCheckNudity = () => {
        setModalShowCheckNudity(!modalShowCheckNudity)
    }

    const toggleModalUploadCloudinary = () => {
        setModalUploadCloudinary(!modalUploadCloudinary)
    }

    const toggleModalUploadGoogleDrive = () => {
        setModalUploadGoogleDrive(!modalUploadGoogleDrive)
    }

    return (
        <CCol xl='3'>

            {/* modalDelete */}
            <CModal show={modalDelete} onClose={toggleModalDelete} centered>
                <CModalBody>
                    Are you sure to delete image {imageInfo.fileName} ?
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={deleteImg}>Delete</CButton>{' '}
                    <CButton color="secondary" onClick={toggleModalDelete}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            {/* modalRemoveBg */}
            <CModal show={modalRemoveBg} onClose={toggleModalRemoveBg} centered>
                <CModalBody>
                    Are you sure to remove background of {imageInfo.fileName} ?
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={removeBg}>Remove</CButton>{' '}
                    <CButton color="secondary" onClick={toggleModalRemoveBg}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            {/* modalChangeBg */}
            <CModal show={modalChangeBg} onClose={toggleModalChangeBg} centered>
                <CModalBody>
                    <CTabs activeTab={activeTab} onActiveTabChange={idx => setActiveTab(idx)}>
                        <CNav variant="tabs">
                            <CNavItem>
                                <CNavLink>
                                    Color Background
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink>
                                    Image Background
                                </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane className="p-3">
                                {/* Enter color
                                <CInput type="text" onChange={e => setColorChangeBg(e.target.value)}></CInput> */}
                                <CRow>
                                    <CCol md="6" className="form-check">
                                        <input className="form-check-input" type="radio" name="color" value="red" checked={colorChangeBg === 'red'}
                                            id="red" onChange={handleChangeBgColor} />
                                        <label className="form-check-label" htmlFor="red">red</label>
                                    </CCol>
                                    <CCol md="6" className="form-check">
                                        <input className="form-check-input" type="radio" name="color" value="green" checked={colorChangeBg === 'green'}
                                            id="green" onChange={handleChangeBgColor} />
                                        <label className="form-check-label" htmlFor="green">green</label>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol md="6" className="form-check">
                                        <input className="form-check-input" type="radio" name="color" value="yellow" checked={colorChangeBg === 'yellow'}
                                            id="yellow" onChange={handleChangeBgColor} />
                                        <label className="form-check-label" htmlFor="yellow">yellow</label>
                                    </CCol>
                                    <CCol md="6" className="form-check">
                                        <input className="form-check-input" type="radio" name="color" value="blue" checked={colorChangeBg === 'blue'}
                                            id="blue" onChange={handleChangeBgColor} />
                                        <label className="form-check-label" htmlFor="blue">blue</label>
                                    </CCol>
                                </CRow>
                            </CTabPane>
                            <CTabPane className="p-3">
                                Upload Image
                                <CInput className="mt-3" type="file" onChange={e => setImgBg(e.target.files)}></CInput>
                            </CTabPane>
                        </CTabContent>
                    </CTabs>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={changeBg}>Change</CButton>{' '}
                    <CButton color="secondary" onClick={toggleModalChangeBg}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            {/* modal ket qua check nudity */}
            <CModal show={modalShowCheckNudity} onClose={toggleModalShowCheckNudity} centered>
                <CModalBody>
                    {isNudity === -1 ? <CAlert color='success'>No nudity content</CAlert> :
                        <CAlert color='danger'>Include nudity content</CAlert>}
                    <CButton style={{ marginRight: '0' }} color="primary" onClick={toggleModalShowCheckNudity}>OK</CButton>
                </CModalBody>
            </CModal>

            {/* modal hien thi cac tag */}
            <CModal show={modalShowTags} onClose={toggleModalShowTags} centered>
                <CModalHeader>
                    <CModalTitle>Tags</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-4 mt-2">
                        <CCol md='2'>Add tag:</CCol>
                        <CCol >
                            <CInput md='8' type='text' value={tagAddManual}
                                onChange={(e) => { setTagAddManual(e.target.value) }}></CInput>
                        </CCol>
                        <CCol md='2'>
                            <CButton color="success" onClick={addTagManual}>Add</CButton>
                        </CCol>
                    </CRow>
                    <CRow>
                        {listTags.length === 0 ? <CAlert>There is no tag</CAlert> :
                            listTags.map(tag => {
                                return <div key={tag} className='p-1 m-2' 
                                    style={{ border: '1px solid', borderRadius: '10px', display: 'inline-block', color: '#3399ff' }}>
                                    {tag}
                                    <CButton color='light' className='ml-2 p-0 m-0' onClick={() => deleteTag(tag)}>x</CButton>
                                </div>
                            })
                        }
                    </CRow>
                    {
                        isLoadingImg ?
                            (<div className='m-2'>
                                <span className="spinner-border spinner-border-sm text-success" role="status" aria-hidden="true"></span>
                                <span className="m-3 text-success">Loading...</span>
                            </div>)
                            : null
                    }
                </CModalBody>
                <CModalFooter>
                    <CButton color="success" onClick={autoTagging}>Add tag auto</CButton>
                    <CButton color="primary" onClick={toggleModalShowTags}>OK</CButton>
                </CModalFooter>
            </CModal>


            {/* modal hien thi ket qua upload len cloudinary */}
            <CModal show={modalUploadCloudinary} onClose={toggleModalUploadCloudinary} centered>
                <CModalBody>
                    {
                        resultUploadCloudinary === 1 ? <CAlert color='success'>Upload to cloudinary successfully</CAlert>
                            : <CAlert color='danger'>Please connect to cloudinary before upload</CAlert>
                    }
                    <CButton color="primary" onClick={toggleModalUploadCloudinary}>OK</CButton>
                </CModalBody>
            </CModal>


            {/* modal hien thi ket qua upload len google drive */}
            <CModal show={modalUploadGoogleDrive} onClose={toggleModalUploadGoogleDrive} centered>
                <CModalBody>
                    {
                        resultUploadGoogleDrive === 1 ? <CAlert color='success'>Upload to cloudinary successfully</CAlert>
                            : <CAlert color='danger'>Please connect to cloudinary before upload</CAlert>
                    }
                    <CButton color="primary" onClick={toggleModalUploadGoogleDrive}>OK</CButton>
                </CModalBody>
            </CModal>

            {/* image card */}
            <CCard>
                <CCardHeader >
                    <CRow>
                        <CCol>
                            <CDropdown className="m-1" style={{ display: 'inline-block' }}>
                                <CDropdownToggle>
                                    {imageInfo.fileName}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem onClick={toggleModalDelete}>Delete</CDropdownItem>
                                    <CDropdownItem onClick={toggleModalRemoveBg}>Remove background</CDropdownItem>
                                    <CDropdownItem onClick={toggleModalChangeBg}>Change background</CDropdownItem>
                                    <CDropdownItem onClick={showTag}>Show tag</CDropdownItem>
                                    <CDropdownItem onClick={checkNudity}>Check nudity content</CDropdownItem>
                                    <CDropdownItem onClick={uploadCloudinary}>Upload cloudinary</CDropdownItem>
                                    <CDropdownItem onClick={uploadGoogleDrive}>Upload google drive</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                        <CCol xl='2'>
                            <CInput type='checkbox' onChange={() => onFunction.onCheck(imageInfo.id, imageInfo.url)}></CInput>
                        </CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody>
                    <CCardImg height="200px" src={`${API_URL}/image${imageInfo.url}?q=${Math.random()}`}></CCardImg>
                </CCardBody>
                <CCardFooter>
                    <CRow>
                        <CCol className='p-1 pl-3' xl='7'>Type: <b>{imageInfo.mimetype}</b></CCol>
                        <CCol className='p-1'>Size: <b>{(Math.round(imageInfo.size / 1024 / 1024 * 100)) / 100} GB</b></CCol>
                    </CRow>
                    {
                        isLoadingImg ?
                            (<div className='m-2'>
                                <span className="spinner-border spinner-border-sm text-success" role="status" aria-hidden="true"></span>
                                <span className="m-3 text-success">Loading...</span>
                            </div>)
                            : null
                    }
                </CCardFooter>
            </CCard>
        </CCol>
    )
}


export default React.memo(ImageCard)