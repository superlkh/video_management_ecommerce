import React, {useState, useEffect, useRef} from 'react'
// Import services
import projectService from 'src/services/project.service'
import ProjectCard from './ProjectCard'

import { 
    CButton,
    CContainer, 
    CInput, 
    CLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CAlert,
    CPagination,
    CRow,
    CInputGroup,
    CInputGroupAppend,
    CForm,
    CCard,
    CCardBody,
    CCol,
    CDropdown,
    CDropdownToggle
 } from '@coreui/react'

 import CIcon from '@coreui/icons-react'
//  import {Editor, EditorState} from 'draft-js'

const Project = () => {

    // Đếm số trang
    const [countPages, setCountPages] = useState(10)
    // Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1)

    // Sử dụng state khởi tạo project khi tạo project mới
    const [projectName, setProjectName] = useState('')
    const [projectTag, setProjectTag] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [keyWord, setKeyWord] = useState('')

    // Thông báo tên project không hợp lệ khi tạo project mới
    const [invalidProject, setInvalidProject] = useState(null)

    const [projects, setProjects] = useState(null)

    // STATE LIÊN QUAN ĐẾN SEARCH PROJECT
    // const [searchProjects, setSearchProjects] = useState(null)
    // const [currentPageSearch, setCurrentPageSearch] = useState(1)
    // const [countPagesSearch, setCountPagesSearch] = useState(1)
    // const [searchWord, setSearchWord] = useState(null)
    // const [searchType, setSearchType] = useState(0)

    // const [hidePageSearch, setHidePageSearch] = useState(true)
    const [hidePageOwn, setHidePageOwn] = useState(false)
    const [hidePageWork, setHidePageWork] = useState(false)
    // const searchTypes = [
    //     'Projects that you own',
    //     'Projects that you are participating'
    // ]


    const [modal, setModal] = useState(false)
    // Set state cho tìm project
    // const[queryProject, setQueryProject] = useState('')


    // KHAI BÁO: những project mà user được thêm vào
    const [workingProjects, setWorkingProjects] = useState()
    const [currentPageWorking, setCurrentPageWorking] = useState(1)
    const [countPagesWorking, setCountPagesWorking] = useState(1)
    const [keyWordWorking, setKeyWordWorking] = useState('')



    const toggle = ()=>{
        setModal(!modal);
    }
    

    useEffect(async() => {
        if(!localStorage.getItem('X-Auth-Token')){
            return null
        }
       await getUserProjects(currentPage)
       await getWorkingProjects(currentPageWorking)
    }, [])

    // Lấy project mà người dùng đang quản lý
    const getUserProjects = async(page, keyWord) => {
        const list = await projectService.getUserProjects(page, keyWord)
    
        if(list.data.data === null){
            return
        }
        const data = list.data.data.rows
        if(parseInt(list.data.data.count) % 5 !== 0){
            setCountPages(Math.round(parseInt(list.data.data.count) / 5 + 0.5))
        } else {
            setCountPages(Math.round(parseInt(list.data.data.count) / 5))
        }
        setProjects(data.map(project => {
            return <ProjectCard key={project.id} projectInfo={project}/>   
        }))

        if(list.data.data.count > 5){
            setHidePageOwn(false)
        } else {
            setHidePageOwn(true)
        }
    }

    // Lấy project mà người dùng không phải quản lý nhưng đang tham gia
    const getWorkingProjects = async(page, keyWordWorking) => {
        const projects = await projectService.getWorkingProjects(page, keyWordWorking)
        if(projects.data.status === "OK"){
            const data = projects.data.data.rows
            if(parseInt(projects.data.data.count) % 5 !== 0){
                setCountPagesWorking(Math.round(parseInt(projects.data.data.count) / 5 + 0.5))
            } else {
                setCountPagesWorking(Math.round(parseInt(projects.data.data.count) / 5))
            }
            setWorkingProjects(data.map(project =>{
                if(!project){
                    return
                }
                return <ProjectCard key ={project.id} projectInfo={project}></ProjectCard>
            }))

            if(projects.data.data.count > 5){
                setHidePageWork(false)
            } else {
                setHidePageWork(true)
            }
        }
    }

    // Tạo project
    const createNewProject = async() => {
        const newProjectData = {
            projectName: projectName,
            tag: projectTag,
            description: projectDescription
        }
        const data = await projectService.createProject(newProjectData)
        if(data.data.status !== 'OK'){
        // setInvalidProject(<CAlert color="danger">Invalid project name</CAlert>)
            setInvalidProject(<CAlert color="danger">{data.data.errors}</CAlert>)
        } else {
            toggle()
            setCurrentPage(1)
            await getUserProjects(1)
        }
            
        }
    // Thay đổi trang
    const pageChange = async(i) => {
        setCurrentPage(i)
        await getUserProjects(i, keyWord)
    }
    // // Search project
    // const findProjects = (e) => {
    //     setSearchWord(e.target.value)
    //     const res = projectService.searchProject(e.target.value, searchType)
    //     res.then(value => {
    //         if(value.data.status === 'OK' && value.data.data.count !== 0 ){
    //             const data = value.data.data.rows
    //             if(parseInt(value.data.data.count) % 5 !== 0){
    //                 setCountPagesSearch(Math.round(parseInt(value.data.data.count) / 5 + 0.5))
    //             } else {
    //                 setCountPagesSearch(Math.round(parseInt(value.data.data.count) / 5))
    //             }
    //             setSearchProjects(data.map(project => {
    //                 if(!project){
    //                     return null
    //                 }
    //                 return <ProjectCard key={project.id} projectInfo={project}></ProjectCard>
    //             }))

    //             if(value.data.data.count > 5){
    //                 setHidePageSearch(false)
    //             } else{
    //                 setHidePageSearch(true)
    //             }
    //         }
    //     })
    // }
    // Thay đổi trang của search project
    // const pageChangeSeach = (i) => {
    //     setCurrentPageSearch(i)
    //     const projectsData = projectService.searchProject(searchWord, i)

    //     projectsData.then(list => {
    //         const data = list.data.data.rows
    //         if(parseInt(list.data.data.count) % 5 !== 0){
    //             setCountPagesSearch(Math.round(parseInt(list.data.data.count) / 5 + 0.5))
    //         } else {
    //             setCountPagesSearch(Math.round(parseInt(list.data.data.count) / 5))
    //         }
    //         setSearchProjects(data.map(project => {
    //             return <ProjectCard key={project.id} projectInfo={project}/>   
    //         }))
    //     })
    // }
    // Thay đổi trang của working projects
    const pageChangeWorking = async(i) => {
        setCurrentPageWorking(i)
        await getWorkingProjects(i, keyWordWorking)
    }
    return(
        <CContainer>
            <CButton color="primary" onClick={toggle}>Create New Project</CButton>
            {/* Tạo project */}
            <CModal
                show={modal}
                onClose={toggle}
                centered
            >
                <CModalHeader closeButton>Please enter the information for new project</CModalHeader>
                <CModalBody>
                <CForm>
                    <CInput placeholder="Enter project name..." onChange={((e) => setProjectName(e.target.value))}></CInput>
                    <br/>
                    <CInput placeholder="Tags..." onChange={((e) => setProjectTag(e.target.value))}></CInput>
                    <br/>
                    <CInput placeholder="Description..." onChange={((e) => setProjectDescription(e.target.value))}></CInput>
                </CForm>
                </CModalBody>
                {invalidProject}
                <CModalFooter>
                    <CButton color="primary" onClick={createNewProject}>Create new project</CButton>{' '}
                        <CButton
                            color="secondary"
                            onClick={toggle}
                        >Cancel</CButton>
                </CModalFooter>
            </CModal>
            {/* <hr/> */}
            {/* <CLabel><h5>Search project</h5></CLabel>
            <CCard>
                <CCardBody>
                    <CRow>
                    <CCol sm="8">
                    <CInputGroup>
                        <CInput placeholder="Find project by name..." onChange={findProjects}></CInput>
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
                            for (let i = 0; i < searchTypes.length; i++){
                                if(searchTypes[i] === e.target.value){
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
            <br/>
            <CRow>
                {searchProjects}
            </CRow>
            <CPagination
                hidden={hidePageSearch}
                activePage={currentPageSearch}
                pages={countPagesSearch}
                onActivePageChange={pageChangeSeach}
            ></CPagination> */}
            <hr/>
            <CLabel><h5>Projects That You Own</h5></CLabel>
            <br/>
            <CInputGroup>
                        <CInput placeholder="Find project by name..." onChange={async(e) => {
                            setCurrentPage(1)
                            setKeyWord(e.target.value)
                            await getUserProjects(1, e.target.value)
                        }}></CInput>
                        <CInputGroupAppend>
                            <CButton color="primary">
                                <CIcon name="cil-magnifying-glass" />
                            </CButton>
                        </CInputGroupAppend>
                    </CInputGroup>
            <CRow>
                {projects}
            </CRow>
            <CPagination
                hidden={hidePageOwn}
                activePage={currentPage}
                pages={countPages}
                onActivePageChange={pageChange}
            ></CPagination>
            <hr/>
            <CLabel><h5>Projects that you are working</h5></CLabel>
            <br/>
            <CInputGroup>
                        <CInput placeholder="Find project by name..." onChange={async(e) => {
                            setCurrentPageWorking(1)
                            setKeyWordWorking(e.target.value)
                            await getWorkingProjects(1, e.target.value)
                        }}></CInput>
                        <CInputGroupAppend>
                            <CButton color="primary">
                                <CIcon name="cil-magnifying-glass" />
                            </CButton>
                        </CInputGroupAppend>
                    </CInputGroup>
            <CRow>
                {workingProjects}
            </CRow>
            <CPagination
                hidden={hidePageWork}
                activePage={currentPageWorking}
                pages={countPagesWorking}
                onActivePageChange={pageChangeWorking}
            ></CPagination>
        </CContainer>
    )
}

export default Project