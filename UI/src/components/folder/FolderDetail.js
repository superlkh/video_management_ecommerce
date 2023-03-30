import React, { useEffect, useState } from 'react'
import axios from 'axios'
import api from 'src/config/api.config'

import notificationService from 'src/services/notification.service'
import notifConfig from 'src/config/notification.config'

import ImageCard from '../image/ImageCard'
import FolderCard from './FolderCard'
import CIcon from '@coreui/icons-react'
import {
    CCol,
    CCard,
    CCardBody,
    CRow,
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
    CInputFile,
    CContainer,
    CPagination,
    CInputGroup,
    CInputGroupAppend,
    CModalHeader,
    CTooltip
} from '@coreui/react'

import { folderService } from 'src/services/folder.service'
import imageService from 'src/services/image.service'
import videoService from 'src/services/video.service'

import VideoCard from 'src/components/video/VideoCard'

import { useHistory, useLocation } from 'react-router'
import ImageLayer from '../image/ImageLayer'
import { element } from 'prop-types'
import projectService from 'src/services/project.service'
require('dotenv').config()
const Folder = (props) => {

    const projectId = props.match.params.projectId
    const folderId = props.match.params.folderId
    const folderPageSize = process.env.REACT_APP_PAGE_SIZE_FOLDER
    const imgPageSize = process.env.REACT_APP_PAGE_SIZE_IMAGE
    const token = localStorage.getItem('X-Auth-Token')


    // de load lai page
    const [loadPage, setLoadPage] = useState(false)
    // cac modal cua page
    const [folderNameCreate, setFolderNameCreate] = useState('')
    const [modalInsert, setModalInsert] = useState(false)
    const [modalUploadVideo, setModalUploadVideo] = useState(false)
    const [modalUploadImages, setModalUploadImages] = useState(false)
    const [modalCreateVid, setModalCreateVid] = useState(false)
    const [modalUploadImageFromUrl, setModalUploadImageFromUrl] = useState(false)

    const [isUploadedVideo, setIsUploadedVideo] = useState(null)
    const [fileVideo, setFileVideo] = useState('')

    const [isUploadedImages, setIsUploadedImages] = useState(null)
    const [fileImages, setFileImages] = useState('')

    // folder
    const [listFolder, setListFolder] = useState([])
    const [countPagesFolder, setCountPagesFolder] = useState(1)
    const [currentPageFolder, setCurrentPageFolder] = useState(1)
    const [hidePageFolder, setHidePageFolder] = useState(false)

    // image
    const [listImg, setListImg] = useState(null)
    const [countPagesImg, setCountPagesImg] = useState(1)
    const [currentPageImg, setCurrentPageImg] = useState(1)
    const [hidePageImg, setHidePageImg] = useState(false)

    // create video from images
    const [imgToCreateVIdeo, setImgToCreateVideo] = useState([])
    const [fileMusicCreateVIdeo, setFileMusicCreateVIdeo] = useState(null)
    const [resolutionCreateVideo, setResolutionCreateVideo] = useState('240p')

    // HUY --- Image Layer
    const [imageLayers, setImageLayers] = useState([])
    const [imageFromLayers, setImageFromLayers] = useState(null)

    // HUY --- hiển thị video start
    const [countPagesVideo, setCountPagesVideo] = useState(1)
    const [currentPageVideo, setCurrentPageVideo] = useState(1)
    const [videos, setVideos] = useState(null)
    const [hidePageVideo, setHidePageVideo] = useState(true)

    // Search video
    const [searchVideos, setSearchVideos] = useState(null)
    const [countPagesVideoSearch, setCountPagesVideoSearch] = useState(1)
    const [currentPageVideoSearch, setCurrentPageVideoSearch] = useState(1)
    const [searchType, setSearchType] = useState(0)
    const searchTypes = [
        'video',
        'image'
    ]
    const [hidePageVideoSearch, setHidePageVideoSearch] = useState(true)

    // upload image from url
    const [urlImage, setUrlImage] = useState('')

    // const loadFolders = async () => {
    //     const onHandle = {
    //         onCreate: createFolder,
    //         onUpdate: updateFolder,
    //         onDelete: deleteFolder,
    //         onSetPage: setCurrentPageFolder
    //     }
    //     const properties = {
    //         projectId,
    //     }
    //     const response = await folderService.getFolders(folderId, projectId, currentPageFolder, folderPageSize)
    //     setListFolder(response.data.listFolder.map(folder => {
    //         return (<FolderCard key={folder.id} folderInfo={folder} onFunction={onHandle} properties={properties}></FolderCard>)
    //     }))
    //     setCountPagesFolder(Math.ceil(response.data.count / folderPageSize))
    //     if (Math.ceil(response.data.count / folderPageSize) < 1) {
    //         setHidePageFolder(true)
    //     } else {
    //         setHidePageFolder(false)
    //     }
    // }

    const loadImages = async () => {
        const onHandle = {
            onCheck: chooseImage,
            onReload: function () {
                setLoadPage(!loadPage)
            }
        }
        const resImg = await imageService.getImages(folderId, currentPageImg, imgPageSize)
        if (resImg.data.status === "OK") {
            setListImg(resImg.data.data.listImage.map(img => {
                return (<ImageCard key={img.id} imageInfo={img} onFunction={onHandle} ></ImageCard>)
            }))
            setCountPagesImg(Math.ceil(resImg.data.data.count / imgPageSize))
            if (Math.ceil(resImg.data.data.count / imgPageSize) < 2) {
                setHidePageImg(true)
            } else {
                setHidePageImg(false)
            }
        }

    }

    const loadVideos = async () => {
        const res = await videoService.getVideoList(folderId, currentPageVideo)
        const onHandle = {
            onReload: function () {
                setLoadPage(!loadPage)
            }
        }
        const properties = {
            projectId,
            folderId,
            loadPage
        }
        if (!res.data.data) {
            setVideos(null)
        } else {
            const data = res.data.data.rows
            setCountPagesVideo(Math.round(parseInt(res.data.data.count) / 3 + 0.4))
            setVideos(data.map(video => {
                return <VideoCard key={video.id} videoInfo={video} onFunction={onHandle} properties={properties}></VideoCard>
            }))

            if (res.data.data.count > 3) {
                setHidePageVideo(false)
            } else {
                setHidePageVideo(true)
            }
        }
    }


    useEffect(async () => {
        if (token) {
            // get folder list
            // await loadFolders()

            //get img list
            await loadImages()

            // get video list
            await loadVideos()
        }

    }, [props.match.params.folderId, loadPage])

    if (!token) {
        return (<div>
            <CAlert color="danger">Please log in to use this feature</CAlert>
        </div>)
    }


    // function liên quan folder ________________________________________________________________________________

    // const pageFolderChange = async (i) => {

    //     setCurrentPageFolder(i)
    //     const onHandle = {
    //         onCreate: createFolder,
    //         onUpdate: updateFolder,
    //         onDelete: deleteFolder,
    //         onSetPage: setCurrentPageFolder
    //     }
    //     const properties = {
    //         projectId,
    //     }
    //     const response = await folderService.getFolders(folderId, projectId, i, folderPageSize)
    //     setListFolder(response.data.listFolder.map(folder => {
    //         return (<FolderCard key={folder.id} folderInfo={folder} onFunction={onHandle} properties={properties}></FolderCard>)
    //     }))
    //     setCountPagesFolder(Math.ceil(response.data.count / folderPageSize))

    // }

    // const createFolder = async () => {
    //     const responseCre = await folderService.createFolder(folderId, projectId, folderNameCreate)
    //     if (responseCre.status === 'OK') {
    //         setFolderNameCreate('')
    //         loadFolders()
    //         setModalInsert(false)
    //     }
    // }

    // const deleteFolder = async (folder) => {
    //     const responseDel = await folderService.deleteFolder(folder.id)
    //     if (responseDel.status === 'OK') {
    //         loadFolders()
    //     }
    // }

    // const updateFolder = async (folder, newName) => {
    //     const responseUp = await folderService.updateFolder(folder.id, newName)
    //     if (Array.isArray(responseUp.data)) {
    //         loadFolders()
    //     } else {
    //         alert('Folder name exist')
    //     }
    // }

    // HUY --- hiển thị video start ________________________________________________________________________________

    const pageVideoChange = (i) => {

        setCurrentPageVideo(i)
        const data = videoService.requestVideos(i, folderId)
        const onHandle = {
            onReload: function () {
                setLoadPage(!loadPage)
            }
        }
        const properties = {
            projectId,
            folderId,
            loadPage
        }
        data.then(result => {
            if (!result.data.data) {
                setVideos(null)
            } else {
                const data = result.data.data.rows
                setCountPagesVideo(Math.round(parseInt(result.data.data.count) / 3 + 0.4))
                setVideos(data.map(video => {
                    return <VideoCard key={video.id} videoInfo={video} onFunction={onHandle} properties={properties}></VideoCard>
                }))

                if (result.data.data.count > 3) {
                    setHidePageVideo(false)
                } else {
                    setHidePageVideo(true)
                }
            }
        })
    }

    const pageVideoChangeSearch = (i) => {

        setCurrentPageVideoSearch(i)
        console.log(
            'Page:' + currentPageVideoSearch
        )
        //const data = requestVideos(i)
        const data = videoService.requestVideos(i, folderId)
        const onHandle = {
            onReload: function () {
                setLoadPage(!loadPage)
            }
        }
        const properties = {
            projectId,
            folderId,
            loadPage
        }
        data.then(result => {
            if (!result.data.data) {
                setSearchVideos(null)
            } else {
                const data = result.data.data.rows
                setCountPagesVideoSearch(Math.round(parseInt(result.data.data.count) / 3 + 0.4))
                setSearchVideos(data.map(video => {
                    return <VideoCard key={video.id} videoInfo={video} onFuntion={onHandle} properties={properties}></VideoCard>
                }))
            }
        })
    }

    // HUY ---hiển thị video end

    // HUY---Up load video START ________________________________________________________________________________

    const onChangeModalUploadVideo = (e) => {
        setFileVideo(e.target.files[0])
    }

    const onSubmitModalUploadVideo = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('file', fileVideo)
        formData.append('folderId', folderId)

        try {
            // Gửi request với header gồm token
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'x-access-token': token
                }
            })
            const resData = res.data

            // Tình trạng gửi file

            if (resData.status === 'OK') {
                // HUY-start
                //check nudity

                const resNudity = await videoService.checkNudity(resData.data.path)

                if (resNudity.data.data.isNudity === '1') {
                    await notificationService.addNewNotification({
                        type: notifConfig.notifType.warning,
                        subject: notifConfig.notifSubject.video,
                        content: `${resData.data.fileName} has nudity content`,
                        receiverId: localStorage.getItem('UserId')
                    })
                }


                const resUsers = await projectService.findAllUserId(projectId)

                if (resUsers.data.status === 'OK' && resUsers.data.data.users.length > 0) {
                    const resNotif = await notificationService.addNewNotification({
                        type: notifConfig.notifType.create,
                        subject: notifConfig.notifSubject.video,
                        content: `${localStorage.getItem('Username')} has uploaded ${fileVideo.name} in project ${resUsers.data.data.projectName}`,
                        receiverId: resUsers.data.data.users
                    })
                    if (resNotif.data.status !== 'OK') {
                        alert('Failed to notify')
                    }
                }
                // HUY-end

                // Thành công
                setIsUploadedVideo(<CAlert color="success">{fileVideo.name} was uploaded successfully</CAlert>)
                setModalUploadVideo(false)
                //HUY 
                const res = axios.get(`http://localhost:5000/api/video/${localStorage.getItem('Username')}/${folderId}?page=${currentPageVideo}`, {
                    headers: {
                        'x-access-token': token
                    }
                })

                res.then(result => {
                    const data = result.data.data.rows
                    setCurrentPageVideo(currentPageVideo)
                    setCountPagesVideo(Math.round(parseInt(result.data.data.count) / 3 + 0.4))
                    const onHandle = {
                        onReload: function () {
                            setLoadPage(!loadPage)
                        }
                    }
                    const properties = {
                        projectId,
                        folderId,
                        loadPage
                    }
                    setVideos(data.map(video => {
                        return <VideoCard key={video.id} videoInfo={video} onFunction={onHandle} properties={properties}></VideoCard>
                    }))
                    if (result.data.data.count > 3) {
                        setHidePageVideo(false)
                    } else {
                        setHidePageVideo(true)
                    }
                })
                // HUY
            } else if (resData.status === 'INVALID_REQUEST') {
                // Thất bại
                setIsUploadedVideo(<CAlert color="danger">Failed to upload {fileVideo.name}</CAlert>)
            } else {
                // Thất bại do mất kết nối hoặc do lỗi lạ tại server
                setIsUploadedVideo(<CAlert color="danger">Something's wrong! Cannot upload the file</CAlert>)
            }


        } catch (error) {
            // Thất bại do mất kết nối hoặc do lỗi lạ 
            setIsUploadedVideo(<CAlert color="danger">Something's wrong! Cannot upload the file</CAlert>)
        }
    }

    // HUY---Up load video END


    //Upload images ________________________________________________________________________________


    const toggleModalUploadImage = () => {
        setModalUploadImages(!modalUploadImages)
        setIsUploadedImages(null)
    }

    const onChangeModalUploadImages = (e) => {
        setFileImages(e.target.files)
    }

    const onSubmitModalUploadImages = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        for (let i = 0; i < fileImages.length; i++) {
            formData.append(fileImages[i].name, fileImages[i])
        }

        formData.append('folderId', folderId)

        try {
            // Gửi request với header gồm token
            const res = await imageService.uploadImages(formData)
            if (res.status === 'OK') {
                //setIsUploadedImages(<CAlert color="success">Update successfully</CAlert>)
                setModalUploadImages(!modalUploadImages)
                loadImages()
            }

        } catch (error) {
            // Thất bại do mất kết nối hoặc do lỗi lạ 
            setIsUploadedImages(<CAlert color="danger">Something's wrong! Cannot upload the file</CAlert>)
        }
    }

    const pageImgChange = async (i) => {

        setCurrentPageImg(i)
        const response = await imageService.getImages(folderId, i, imgPageSize)
        if (response.data.status === 'OK') {
            setListImg(response.data.data.listImage.map(img => {
                return (<ImageCard key={img.id} imageInfo={img}></ImageCard>)
            }))
            setCountPagesImg(Math.ceil(response.data.data.count / imgPageSize))
        }
    }


    // Create video from images ________________________________________________________________________________


    const toggleModalCreateVid = () => {
        setModalCreateVid(!modalCreateVid)
    }

    const chooseImage = (id, url) => {

        setImgToCreateVideo(preState => {
            if (preState.includes(id)) {
                let arrImg = [...preState]
                arrImg = arrImg.filter(element => element !== id)
                return arrImg
            } else {
                let arrImg = [...preState]
                arrImg.push(id)
                return arrImg
            }
        })

        setImageLayers(preState => {
            let arrLayer = [...preState]
            let imgUrl = api.url + url

            while (imgUrl.indexOf(' ') !== -1) {
                imgUrl = imgUrl.replace(' ', '%20')
            }


            if (preState.includes(imgUrl)) {
                arrLayer = arrLayer.filter(element => element !== (imgUrl))
                return arrLayer
            } else {
                arrLayer.push(imgUrl)
                return arrLayer
            }
        })

    }

    const createVideo = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('audio', fileMusicCreateVIdeo[0])
        formData.append('folderId', folderId)
        formData.append('resolution', resolutionCreateVideo)
        formData.append('listId', imgToCreateVIdeo)

        const res = await imageService.createVideo(formData)
        if (res.data.status === 'OK') {
            setModalCreateVid(!modalCreateVid)
            setLoadPage(!loadPage)
        }
    }


    // Search HUY-bắt đầu____________________________________________________________________

    const searchVideo = async (e) => {
        const searchInfo = {
            projectId: projectId,
            folderId: folderId,
            videoName: e.target.value,
            type: searchType,
            page: 1
        }
        const res = await videoService.searchVideo(searchInfo)
        if (res.data.status === 'OK' && searchType === 0) {
            const searchResult = res.data.data.rows

            if (searchResult.length !== 0) {
                if (res.data.count > 3) {
                    setHidePageVideoSearch(false)
                }
                setCountPagesVideoSearch(Math.round(parseInt(res.data.data.count) / 3 + 0.4))
                const onHandle = {
                    onReload: function () {
                        setLoadPage(!loadPage)
                    }
                }
                const properties = {
                    projectId,
                    folderId,
                    loadPage
                }
                setSearchVideos(searchResult.map(video => {
                    return <VideoCard key={video.id} videoInfo={video} onFuntion={onHandle} properties={properties}></VideoCard>
                }))
            }

        } else if (res.data.status === 'OK' && searchType === 1) {
            if (res.data.count > imgPageSize) {
                setHidePageVideoSearch(false)
            }
            const onHandle = {
                onCheck: chooseImage,
                onReload: loadImages
            }
            const searchResult = res.data.data.rows
            if (searchResult.length !== 0) {
                setCountPagesVideoSearch(Math.round(parseInt(res.data.data.count) / 3 + 0.4))

                setSearchVideos(searchResult.map(img => {
                    return <ImageCard key={img.id} imageInfo={img} onFunction={onHandle}></ImageCard>
                }))
            }
        }
    }

    // Search HUY-kết thúc


    // Upload image bằng URL ____________________________________________________________________

    const uploadImageFromUrl = async () => {
        try {
            const res = await imageService.uploadImageFromUrl(urlImage)
            if (res.data.status === 'OK') {
                setModalUploadImageFromUrl(!modalUploadImageFromUrl)
                loadImages()
            } else {
                //setModalUploadImageFromUrl(!modalUploadImageFromUrl)
                setIsUploadedImages(<CAlert color="danger">Something's wrong! Cannot upload the file</CAlert>)
            }

        } catch (error) {
            //setModalUploadImageFromUrl(!modalUploadImageFromUrl)
            setIsUploadedImages(<CAlert color="danger">Something's wrong! Cannot upload the file</CAlert>)
        }

    }


    return (
        <>
            <CRow>
                <CCol>
                    <CCard >
                        <CCardBody className="bg-success">
                            {/* <CButton size="xl" className="btn-facebook btn-brand mr-1 mb-1" onClick={() => setModalInsert(true)}>
                                <CIcon size="xl" name="cilLibraryAdd" /><span className="mfs-2">Create folder</span>
                            </CButton> */}
                            <CButton size="xl" className="btn-facebook btn-brand mr-1 mb-1" onClick={() => setModalUploadVideo(true)}>
                                <CIcon size="xl" name="cilCloudUpload" /><span className="mfs-2">Upload video</span>
                            </CButton>
                            <CButton size="xl" className="btn-facebook btn-brand mr-1 mb-1" onClick={() => setModalUploadImages(true)}>
                                <CIcon size="xl" name="cilImagePlus" /><span className="mfs-2">Upload Image</span>
                            </CButton>
                            <CTooltip
                                content="<p>Choose more than 2 images to create video<p>"
                                placement="top"
                            >
                                <span>
                                    <CButton
                                        size="xl" className="btn-facebook btn-brand mr-1 mb-1"
                                        disabled={imgToCreateVIdeo.length > 1 ? false : true}
                                        onClick={toggleModalCreateVid}>
                                        <CIcon size="xl" name="cilVideogame" /><span className="mfs-2">Create Video</span>
                                    </CButton>
                                </span>
                            </CTooltip>

                            <CButton
                                size="xl" className="btn-facebook btn-brand mr-1 mb-1"
                                disabled={imageLayers.length ? false : true}
                                onClick={() => {
                                    setImageFromLayers(null)
                                    setTimeout(() => setImageFromLayers(<ImageLayer layers={imageLayers}></ImageLayer>), 100)

                                }}>
                                <CIcon size="xl" name="cilVideogame" /><span className="mfs-2">Create Image Layers</span>
                            </CButton>
                            <CButton size="xl" className="btn-facebook btn-brand mr-1 mb-1" onClick={() => setModalUploadImageFromUrl(true)}>
                                <CIcon size="xl" name="cilImagePlus" /><span className="mfs-2">Upload Image from url</span>
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Modal Insert */}
            {/* <CModal show={modalInsert} onClose={() => setModalInsert(!modalInsert)} centered>
                <CModalBody>

                    <CCard>
                        <CCardHeader>
                            Tạo thư mục
                        </CCardHeader>
                        <CCardBody>
                            <CForm action="" method="post" className="form-horizontal">
                                <CFormGroup row>
                                    <CCol md="3">
                                        <CLabel htmlFor="hf-email">Tên thư mục</CLabel>
                                    </CCol>
                                    <CCol xs="12" md="9">
                                        <CInput type="text" onChange={(e) => { setFolderNameCreate(e.target.value) }} />
                                    </CCol>
                                </CFormGroup>
                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton size="sm" color="primary" onClick={() => createFolder()}>OK</CButton>{'   '}
                            <CButton size="sm" color="danger" onClick={() => setModalInsert(false)}>Hủy</CButton>
                        </CCardFooter>
                    </CCard>

                </CModalBody>
            </CModal> */}

            {/* Modal Upload Video */}
            <CModal show={modalUploadVideo} centered>
                <CModalBody>
                    <CForm onSubmit={onSubmitModalUploadVideo}>
                        <CFormGroup>
                            <CLabel htmlFor="Custom File">Choose a File To Upload</CLabel>
                            <CInputFile type="file" onChange={onChangeModalUploadVideo} />
                            <br />
                            <CButton size="sm" color="primary" type="submit">Upload</CButton>{'   '}
                            <CButton size="sm" color="danger" onClick={() => setModalUploadVideo(false)}>Cancel</CButton>
                        </CFormGroup>
                    </CForm>
                    {isUploadedVideo}
                </CModalBody>
            </CModal>

            {/* Modal Upload multiple images */}
            <CModal show={modalUploadImages} onClose={toggleModalUploadImage} centered>
                <CModalBody>
                    <CForm onSubmit={onSubmitModalUploadImages}>
                        <CFormGroup>
                            <CLabel htmlFor="Custom File">Choose Files To Upload</CLabel>
                            <CInputFile multiple type="file" onChange={onChangeModalUploadImages} />
                            <br />
                            <CButton size="sm" color="primary" type="submit">Upload</CButton>{'   '}
                            <CButton size="sm" color="danger" onClick={toggleModalUploadImage}>Cancel</CButton>
                        </CFormGroup>
                    </CForm>
                    {isUploadedImages}
                    {/* <ImageEditor/> */}
                </CModalBody>
            </CModal>

            {/* Modal Create Video */}
            <CModal show={modalCreateVid} onClose={toggleModalCreateVid} centered>
                <CModalHeader>
                    <h5>Create video</h5>
                </CModalHeader>

                <CForm onSubmit={createVideo}>
                    <CModalBody>
                        <label for="resolution">Choose a resolution:</label>
                        <select className='ml-3 p-1' name="resolution" id="resolution"
                            onChange={(e) => { console.log(e.target.value); setResolutionCreateVideo(e.target.value) }}>
                            <option value="240p">426x240</option>
                            <option value="360p">640x360</option>
                            <option value="480p">854x480</option>
                            <option value="720p">1280x720</option>
                            <option value="1080p">1920x1080</option>
                        </select>
                        <div className='mb-1'>Choose file music</div>
                        <CInputFile type="file" onChange={(e) => { console.log(e.target.files); setFileMusicCreateVIdeo(e.target.files) }} />
                    </CModalBody>
                    <CModalFooter>
                        <CButton size="sm" color="primary" type="submit">Create</CButton>{'   '}
                        <CButton size="sm" color="danger" onClick={toggleModalCreateVid}>Cancel</CButton>
                    </CModalFooter>
                </CForm>

            </CModal>

            {/* Modal upload image from url */}
            <CModal show={modalUploadImageFromUrl} onClose={() => { setModalUploadImageFromUrl(!modalUploadImageFromUrl) }} centered>
                <CModalBody>
                    <h5>Enter image url</h5>
                    <CInput type='text' placeholder='Enter url' onChange={(e) => { setUrlImage(e.target.value) }}></CInput>
                    {isUploadedImages}
                </CModalBody>
                <CModalFooter>
                    <CButton size="sm" color="primary" onClick={uploadImageFromUrl}>Upload</CButton>{'   '}
                    <CButton size="sm" color="danger" onClick={() => { setModalUploadImageFromUrl(!modalUploadImageFromUrl) }}>No</CButton>
                </CModalFooter>
            </CModal>

            {/* <h2>Folder</h2>

            <CRow>
                {
                    listFolder
                }

            </CRow>

            <CPagination
                hidden={hidePageFolder}
                activePage={currentPageFolder}
                pages={countPagesFolder}
                onActivePageChange={pageFolderChange}
            ></CPagination>
            <hr /> */}

            {/* HUY-Start */}
            {imageFromLayers}
            <hr />
            <CContainer>
                <h2>Search images or videos by name (case sensitive)</h2>
                <CCard>
                    <CCardBody>
                        <CRow>
                            <CCol sm="8">
                                <CInputGroup>
                                    <CInput onChange={searchVideo} placeholder="Search images or videos..." />
                                    <CInputGroupAppend>
                                        <CButton color="primary">
                                            <CIcon name="cil-magnifying-glass" />
                                        </CButton>
                                    </CInputGroupAppend>
                                </CInputGroup>
                            </CCol>
                            <CCol>
                                <select
                                    className="form-control"
                                    onChange={(e) => {
                                        for (let i = 0; i < searchTypes.length; i++) {
                                            if (searchTypes[i] === e.target.value) {
                                                setSearchType(i)
                                                break
                                            }
                                        }
                                    }}
                                >
                                    {searchTypes.map((searchType, i) => (
                                        <option key={i}>{searchType}</option>
                                    ))}
                                </select>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
                <br />
                <CRow>
                    {searchVideos}
                </CRow>
                <CPagination
                    hidden={hidePageVideoSearch}
                    activePage={currentPageVideoSearch}
                    pages={countPagesVideoSearch}
                    onActivePageChange={pageVideoChangeSearch}
                ></CPagination>
            </CContainer>
            <hr />
            {/* HUY */}

            <h2>Image</h2>
            <CRow>
                {listImg}
            </CRow>

            <CPagination
                hidden={hidePageImg}
                activePage={currentPageImg}
                pages={countPagesImg}
                onActivePageChange={pageImgChange}
            ></CPagination>




            {/* HUY */}
            <hr />
            <h2>Video</h2>
            <CContainer>
                <CRow>
                    {videos}

                </CRow>

                <CPagination
                    hidden={hidePageVideo}
                    activePage={currentPageVideo}
                    pages={countPagesVideo}
                    onActivePageChange={pageVideoChange}
                ></CPagination>
            </CContainer>



            {/* HUY */}
        </>
    )
}




export default Folder