import React, { useEffect, useState } from 'react'

import api from 'src/config/api.config'
import captureVideoFrame from 'capture-video-frame'
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
    CInputFile,
    CContainer,
    CPagination,
    CCardImg,
    CModalHeader,
    CImg,
    CBadge,
    CSpinner,
    CInputGroup,
    CInputGroupAppend,
    CListGroup,
    CListGroupItem,
    CMedia,
    CMediaBody,
    CInputGroupPrepend,
    CTextarea,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CModalTitle
} from '@coreui/react'

import videoService from 'src/services/video.service'
import commentServices from 'src/services/comment.service'

import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'

const VideoCard = ({ videoInfo, onFunction, properties }) => {
    const dispatch = useDispatch()
    const length = useSelector(state => state.commandQueue.length)

    const status = (publish) => {
        if (publish === 0) {
            return <CBadge color="secondary">Not published</CBadge>
        } else {
            return <CBadge color="success">Published</CBadge>
        }
    }
    const [videoStatus, setVideoStatus] = useState(status(parseInt(videoInfo.publish)))

    const [modalPlayer, setModalPlayer] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)

    const [videoPlayer, setVideoPlayer] = useState(null)
    const [videoFrame, setVideoFrame] = useState(null)

    const [gifLoading, setGifLoading] = useState()

    // delete video
    const [modalDeleteVideo, setModalDeleteVideo] = useState(false)

    // State của chức năng comment
    const [comments, setComments] = useState()
    const [currentPageComment, setCurrentPageComment] = useState(1)
    const [countPagesComment, setCountPagesComment] = useState(1)
    const [newComment, setNewComment] = useState('')
    const [sendingAlert, setSendingAlert] = useState()
    // --Delete comment
    const [modalDeleteComment, setModalDeleteComment] = useState(false)
    const [currentCommentId, setCurrentCommentId] = useState(null)
    // --Update comment
    const [modalUpdateComment, setModalUpdateComment] = useState(false)
    const [updatedComment, setUpdatedComment] = useState('')
    // --Reply comment
    const [modalReplyComment, setModalReplyComment] = useState(false)
    const [currentComment, setCurrentComment] = useState(null)
    const [childComments, setChildComments] = useState(null)
    const [replyCurrentComment, setReplyCurrentComment] = useState(null)
    const [newReplyComment, setNewReplyComment] = useState(null)

    // hiển thị các tag sau khi thêm tag
    const [modalShowTags, setModalShowTags] = useState(false)
    const [tagAddManual, setTagAddManual] = useState('')
    const [listTags, setListTags] = useState([])

    // modal hien thi ket qua check nudity
    const [modalShowCheckNudity, setModalShowCheckNudity] = useState(false)
    const [isNudity, setIsNudity] = useState(videoInfo.nudity)

    // cac state cua change bg
    const [modalChangeBg, setModalChangeBg] = useState(false)
    const [colorChangeBg, setColorChangeBg] = useState('red')
    const [activeTab, setActiveTab] = useState(0)
    const [imgBg, setImgBg] = useState(null)

    const toggle = () => {
        setModalPlayer(!modalPlayer)
        if (modalPlayer === true) {
            setVideoUrl(null)
        } else {
            getVideoComments(currentPageComment)
            setVideoUrl(api.url + videoInfo.url)
        }
        setVideoFrame(null)
    }

    const takeFrame = () => {
        const video = videoPlayer.getInternalPlayer()
        const frame = captureVideoFrame(video)
        setVideoFrame(<CImg src={frame.dataUri} width="100%" height="100%"></CImg>)
    }

    const data = (player) => {
        if (player !== null) {
            setVideoPlayer(player)
        }
    }

    const publishVideo = () => {
        const info = {
            videoId: videoInfo.id,
            projectId: properties.projectId,
            folderId: properties.folderId,
            videoStatus: 1
        }

        const res = videoService.changeVideoStatus(info)

        res.then(value => {
            if (value.data.status === "OK") {
                setVideoStatus(<CBadge color="success">Published</CBadge>)
            }
        })
    }
    const unPublishVideo = () => {
        const info = {
            videoId: videoInfo.id,
            projectId: properties.projectId,
            folderId: properties.folderId,
            videoStatus: 0
        }

        const res = videoService.changeVideoStatus(info)

        res.then(value => {
            if (value.data.status === "OK") {
                setVideoStatus(<CBadge color="secondary">Not published</CBadge>)
            }
        })
    }

    const dispatchConvertToGif = () => {

        if (length < 1) {
            dispatch({
                type: 'push',
                payload: convertToGif()
            })
        }
    }

    const convertToGif = async () => {
        setGifLoading(
            <CCol>
                <b>Converting...</b>
                <CSpinner color="info" size="sm" />
            </CCol>
        )
        await videoService.convertToGif(videoInfo.id, videoInfo.fileName)
        setGifLoading(null)
        dispatch({
            type: 'shift'
        })
    }

    // Hoang 
    // Check nudity_Start_________________________________________________________________________________________
    const toggleModalShowCheckNudity = () => {
        setModalShowCheckNudity(!modalShowCheckNudity)
    }

    const checkNudity = async () => {
        setGifLoading(
            <CCol>
                <b>Cheking...</b>
                <CSpinner color="info" size="sm" />
            </CCol>
        )
        const res = await videoService.checkNudity(videoInfo.path)
        setGifLoading(null)
        console.log('res.data.data.isNudity: ', res.data.data.isNudity)
        if (res.data.data.isNudity) {
            setIsNudity(res.data.data.isNudity)
            toggleModalShowCheckNudity()
        }
    }
    // Check nudity_End_________________________________________________________________________________________


    // Hoang 
    // Add tag_Start_________________________________________________________________________________________
    const toggleModalShowTags = () => {
        setModalShowTags(!modalShowTags)
    }

    const showTag = async () => {
        const res = await videoService.getTagVideo(videoInfo.id)
        if (res.data.status === 'OK') {
            setListTags(res.data.data.tags)
            toggleModalShowTags()
        }
    }

    const deleteTag = async (tag) => {
        const res = await videoService.deleteTag(videoInfo.id, tag)
        if (res.data.status === 'OK') {
            const res = await videoService.getTagVideo(videoInfo.id)
            if (res.data.status === 'OK') {
                setListTags(res.data.data.tags)
            }
        }
    }

    const addTagManual = async () => {
        const res = await videoService.addTagManual(videoInfo.id, tagAddManual)
        if (res.data.status === 'OK') {
            const res = await videoService.getTagVideo(videoInfo.id)
            if (res.data.status === 'OK') {
                setListTags(res.data.data.tags)
            }
            setTagAddManual('')
        }
    }

    const autoTagging = async () => {
        setGifLoading(
            <CCol>
                <b>Cheking...</b>
                <CSpinner color="info" size="sm" />
            </CCol>
        )
        const res = await videoService.autoTagging(videoInfo.path)
        if (res.data.status === 'OK') {
            setGifLoading(null)
            setListTags(res.data.data.tags)
        }
    }
    // Auto tagging_End_________________________________________________________________________________________


    // Hoang
    // Change background_Start__________________________________________________________________________________

    const toggleModalChangeBg = () => {
        setModalChangeBg(!modalChangeBg)
    }

    const handleChangeBgColor = (e) => {
        setColorChangeBg(e.target.value)
    }

    const changeBg = async () => {
        if (activeTab === 0) {
            setModalChangeBg(!modalChangeBg)
            setGifLoading(
                <CCol>
                    <b>Cheking...</b>
                    <CSpinner color="info" size="sm" />
                </CCol>
            )
            const res = await videoService.changeBgColor(colorChangeBg, videoInfo.path)
            if (res.data.status === 'OK') {
                setGifLoading(null)
                onFunction.onReload()
            }
        } else if (activeTab === 1) {
            const formData = new FormData()
            formData.append('image', imgBg[0])
            formData.append('path', videoInfo.path)
            setModalChangeBg(!modalChangeBg)
            setGifLoading(
                <CCol>
                    <b>Cheking...</b>
                    <CSpinner color="info" size="sm" />
                </CCol>
            )
            const res = await videoService.changeBgImg(formData)
            if (res.data.status === 'OK') {
                setGifLoading(null)
                onFunction.onReload()
            }
        }
    }
    // Change background_End_________________________________________________________________________________________

    // CHỨC NĂNG: COMMENT
    const getVideoComments = async (page) => {
        const res = await commentServices.getVideoComments(videoInfo.id, page)
        if (res.data.status === 'OK' && res.data.data.count > 0) {
            const commentList = res.data.data.rows
            if (parseInt(res.data.data.count) % 5 !== 0) {
                setCountPagesComment(Math.round(parseInt(res.data.data.count) / 5 + 0.5))
            } else {
                setCountPagesComment(Math.round(parseInt(res.data.data.count) / 5))
            }
            setComments(commentList.map(comment => {
                return (
                    <CCard key={comment.id}>
                        <CCardBody>
                            <CRow>
                                <CCol lg="8">
                                    <CInputGroup>
                                        <CInputGroupPrepend>
                                            <CIcon name='cil-user' size='3xl' />
                                        </CInputGroupPrepend>
                                        <CMedia>
                                            <CMediaBody>
                                                <h5>{comment.username}</h5>
                                                <CTextarea disabled plaintext={true} value={comment.content} />
                                            </CMediaBody>
                                        </CMedia>
                                    </CInputGroup>
                                </CCol>
                                <CCol>
                                    <CRow className="justify-content-center">
                                        <CButton color="primary" size='sm' onClick={() => {
                                            toggleReplyComment(comment)
                                        }}>Reply</CButton>
                                        <CButton color="info" size='sm' onClick={() => {
                                            toggleUpdateComment(comment.id)
                                        }}>Update</CButton>
                                        <CButton color="danger" size='sm' onClick={() => {
                                            setModalDeleteComment(true)
                                            setCurrentCommentId(comment.id)
                                        }}>Delete</CButton>
                                    </CRow>
                                    <br />
                                    <CRow className="justify-content-center">
                                        <b>Last Modified</b>
                                    </CRow>
                                    <CRow className="justify-content-center">
                                        <CLabel>{comment.updatedAt}</CLabel>
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                )
            }))
        } else {
            setComments(<h4>No comments</h4>)
        }
    }

    const getChildComments = async (videoId, commentId) => {
        const res = await commentServices.getChildComments(videoId, commentId)
        if (res.data.status === 'OK') {
            setChildComments(res.data.data.map(comment => {
                return (

                    <CCard key={comment.id}>
                        <CCardBody>
                            <CRow>
                                <CCol lg="8">
                                    <CInputGroup>
                                        <CInputGroupPrepend>
                                            <CIcon name='cil-user' size='3xl' />
                                        </CInputGroupPrepend>
                                        <CMedia>
                                            <CMediaBody>
                                                <h5>{comment.username}</h5>
                                                <CTextarea disabled plaintext={true} value={comment.content} />
                                            </CMediaBody>
                                        </CMedia>
                                    </CInputGroup>
                                </CCol>
                                <CCol>
                                    <CRow className="justify-content-center">
                                        <CButton color="primary" size='sm' onClick={() => {
                                            toggleReplyComment(comment)
                                        }}>Reply</CButton>
                                        <CButton color="info" size='sm' onClick={() => {
                                            toggleUpdateComment(comment.id)
                                        }}>Update</CButton>
                                        <CButton color="danger" size='sm' onClick={() => {
                                            setModalDeleteComment(true)
                                            setCurrentCommentId(comment.id)
                                        }}>Delete</CButton>
                                    </CRow>
                                    <br />
                                    <CRow className="justify-content-center">
                                        <b>Last Modified</b>
                                    </CRow>
                                    <CRow className="justify-content-center">
                                        <CLabel>{comment.updatedAt}</CLabel>
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                )
            }))
        }
    }

    const commentVideo = async (commentId) => {
        
        setSendingAlert(
            <CCol>
                Sending...
                <CSpinner color="info" size='sm'></CSpinner>
            </CCol>
        )

        let requestInfo = {
            projectId: properties.projectId,
            folderId: properties.folderId,
            videoId: videoInfo.id,
            comment: newComment
        }
        if (commentId) {
            requestInfo.comment = newReplyComment
            requestInfo.commentParentId = commentId
        }
        const res = await commentServices.commentVideo(requestInfo)

        if (res.data.status === 'OK' && !commentId) {
            setSendingAlert(null)
            setCurrentPageComment(1)
            await getVideoComments()
        } else if (res.data.status === 'OK' && commentId) {
            setSendingAlert(null)
            await getChildComments(videoInfo.id, commentId)
        } else {
            setSendingAlert(<CAlert color="danger">You're not allowed</CAlert>)
        }
    }

    const pageChangeComment = async (i) => {
        setCurrentPageComment(i)
        await getVideoComments(i)
    }

    const toggleUpdateComment = async (commentId) => {
        setCurrentCommentId(commentId)
        setModalUpdateComment(!modalUpdateComment)
    }

    const toggleDeleteComment = async (commentId) => {
        setCurrentCommentId(commentId)
        setModalDeleteComment(!modalDeleteComment)
    }

    const toggleReplyComment = async (comment) => {
        setModalReplyComment(!modalReplyComment)
        if (comment) {
            setCurrentCommentId(comment.id)
        }

        if (!modalReplyComment) {
            setCurrentComment(
                <CCard key={comment.id}>
                    <CCardBody>
                        <CRow>
                            <CCol lg="8">
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CIcon name='cil-user' size='3xl' />
                                    </CInputGroupPrepend>
                                    <CMedia>
                                        <CMediaBody>
                                            <h5>{comment.username}</h5>
                                            <p>{comment.content}</p>
                                        </CMediaBody>
                                    </CMedia>
                                </CInputGroup>
                            </CCol>
                            <CCol>
                                <CRow className="justify-content-center">
                                    <b>Last Modified</b>
                                </CRow>
                                <CRow className="justify-content-center">
                                    <CLabel>{comment.updatedAt}</CLabel>
                                </CRow>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            )
            await getChildComments(videoInfo.id, comment.id)
        } else {
            setCurrentComment(null)
        }
    }

    const deleteComment = async () => {
        const res = await commentServices.deleteComment(currentCommentId)

        if (res.data.status === 'OK') {
            setModalDeleteComment(false)
            await getVideoComments(currentPageComment)

        } else {
            alert('Not allowed')
        }
    }

    const updateComment = async () => {
        const res = await commentServices.updateComment(currentCommentId, updatedComment)
        if (res.data.status === 'OK') {
            toggleUpdateComment()
            await getVideoComments(currentPageComment)
        } else {
            alert('Failed to update')
        }
    }

    // delete video Hoang

    const toggleModalDeleteVideo = () => {
        setModalDeleteVideo(!modalDeleteVideo)
    }

    const deleteVideo = async () => {
        const res = await videoService.deleteVideo(videoInfo.id)
        if (res.data.status === 'OK') {
            toggleModalDeleteVideo()
            onFunction.onReload(!properties.loadPage)
        }
    }

    const removeBackground = async () => {
        setGifLoading(
            <CCol>
                <b>Cheking...</b>
                <CSpinner color="info" size="sm" />
            </CCol>
        )
        const res = await videoService.removeBackground(videoInfo.path)
        if (res.data.status === 'OK') {
            setGifLoading(null)
            onFunction.onReload(!properties.loadPage)
        }
    }


    if (!videoInfo) {
        return null
    }
    return (
        <CCol md='4' >
            {gifLoading}

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
                                    style={{ border: '1px solid', borderRadius: '10px', display: 'inline-block' }}>
                                    {tag}
                                    <CButton color='light' className='ml-2 p-0 m-0' onClick={() => deleteTag(tag)}>x</CButton>
                                </div>
                            })
                        }
                    </CRow>
                    {
                        gifLoading ?
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

            {/* modal Change Background */}
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

            <CCard draggable>
                <CModal
                    show={modalPlayer}
                    onClose={toggle}
                    size="lg"
                    centered
                >
                    <CModalHeader closeButton>
                        <CLabel>
                            <h3>{videoInfo.fileName}</h3>
                        </CLabel>
                    </CModalHeader>
                    <CModalBody >
                        <ReactPlayer
                            id={videoInfo.id}
                            ref={data}
                            url={videoUrl}
                            controls
                            width="100%"
                            height="100%"
                            playing={true}
                            config={{ file: { attributes: { crossOrigin: 'anonymous' } } }}>
                        </ReactPlayer>
                        <CButton color="primary" onClick={takeFrame}>Capture Frame</CButton>
                        {videoFrame}
                    </CModalBody>
                    <CModalFooter>
                        <CContainer>
                            <CRow >
                                <CCol sm="12">
                                    <CForm onSubmit={() => {
                                        commentVideo()
                                    }}>
                                        <CInputGroup >
                                            <CTextarea placeholder='Comment...' onChange={(e) => {
                                                e.preventDefault()
                                                setNewComment(e.target.value)
                                            }} />
                                            <CButton color="primary" type="submmit">Send</CButton>
                                        </CInputGroup>
                                    </CForm>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                {sendingAlert}
                            </CRow>
                            <hr />
                            {comments}
                            <CPagination
                                activePage={currentPageComment}
                                pages={countPagesComment}
                                onActivePageChange={pageChangeComment}
                            ></CPagination>
                        </CContainer>
                    </CModalFooter>
                </CModal>

                {/* Delete Comment */}
                <CModal
                    show={modalDeleteComment}
                    onClose={toggleDeleteComment}
                >
                    <CModalHeader closeButton>
                        Delete Comment
                    </CModalHeader>
                    <CModalBody >
                        Do you want to delete this comment?
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={deleteComment}>Yes</CButton>
                        <CButton color="primary" onClick={toggleDeleteComment}>No</CButton>
                    </CModalFooter>
                </CModal>

                {/* Update Comment */}
                <CModal
                    show={modalUpdateComment}
                    onClose={toggleUpdateComment}
                >
                    <CModalHeader closeButton>
                        Update Comment
                    </CModalHeader>
                    <CModalBody >
                        <CInput onChange={(e) => {
                            setUpdatedComment(e.target.value)
                        }} />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={updateComment}>Update</CButton>
                        <CButton color="primary" onClick={toggleUpdateComment}>Cancel</CButton>
                    </CModalFooter>
                </CModal>

                {/* Reply Comment */}
                <CModal
                    show={modalReplyComment}
                    onClose={toggleReplyComment}
                    size='lg'
                >
                    <CModalHeader closeButton>
                        Reply Comment
                    </CModalHeader>
                    <CModalBody >
                        {currentComment}
                        <hr />
                        <CCol sm="10">
                            {childComments}
                        </CCol>

                    </CModalBody>
                    <CModalFooter>
                        <CContainer>
                            <CRow >
                                <CCol sm="12">
                                    <CForm onSubmit={() => {
                                        commentVideo(currentCommentId)
                                    }}>
                                        <CInputGroup >
                                            <CTextarea placeholder='Comment...' onChange={(e) => setNewReplyComment(e.target.value)} />
                                            <CButton color="primary" type="submmit">Send</CButton>
                                        </CInputGroup>
                                    </CForm>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                {sendingAlert}
                            </CRow>
                        </CContainer>
                    </CModalFooter>
                </CModal>

                {/* Modal delete video */}
                <CModal show={modalDeleteVideo} onClose={toggleModalDeleteVideo} centered>
                    <CModalBody>
                        Are you sure to delete video {videoInfo.fileName} ?
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={deleteVideo}>Delete</CButton>{' '}
                        <CButton color="secondary" onClick={toggleModalDeleteVideo}>Cancel</CButton>
                    </CModalFooter>
                </CModal>


                {/* hiển thị card video */}
                <CCardHeader>
                    <CDropdown>
                        <CDropdownToggle>
                            <b>{videoInfo.fileName}</b>
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem onClick={publishVideo}>Publish</CDropdownItem>
                            <CDropdownItem onClick={unPublishVideo}>Unpublish</CDropdownItem>
                            <CDropdownItem divider />
                            <CDropdownItem onClick={toggleModalDeleteVideo}>Delete</CDropdownItem>
                            <CDropdownItem onClick={dispatchConvertToGif}>Convert To Gif</CDropdownItem>
                            <CDropdownItem onClick={checkNudity}>Check nudity</CDropdownItem>
                            <CDropdownItem onClick={showTag}>Show tag</CDropdownItem>
                            <CDropdownItem onClick={removeBackground}>Remove background</CDropdownItem>
                            <CDropdownItem onClick={toggleModalChangeBg}>Change background</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>

                </CCardHeader>
                <CCardBody onClick={toggle}>
                    <CCardImg src={api.url + videoInfo.thumbnailUrl}></CCardImg>

                </CCardBody>
                <CCardFooter>
                    <CRow>
                        <CCol md='3'>Type: <b>{videoInfo.mimetype}</b></CCol>
                        <CCol md='3'>Status: {videoStatus}</CCol>
                        <CCol md='6'>Size: <b>{Math.round(videoInfo.size / 1024 / 1024 * 100) / 100} MB</b></CCol>
                    </CRow>
                    <br />
                    <CRow>

                    </CRow>
                </CCardFooter>
            </CCard>
        </CCol>
    )
}

export default VideoCard