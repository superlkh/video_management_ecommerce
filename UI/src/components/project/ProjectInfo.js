import React, {useState, useEffect} from 'react'
import {
    CInput,
    CCard,
    CCol,
    CRow,
    CFormGroup,
    CLabel,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CButton,
    CAlert,
    CListGroup,
    CListGroupItem,
    CContainer
} from '@coreui/react'

import {useHistory} from 'react-router'

import projectService from 'src/services/project.service'
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js'

const ProjectInfo = (props) => {
    const projectId = props.match.params.projectId

    const history = useHistory()

    const [project, setProject] = useState({})

    const [newProjectName, setNewProjectName] = useState()
    const [newProjectTag, setNewProjectTag] = useState()
    const [newProjectDescription, setNewProjectDescription] = useState()

    const [projectMember, setProjectMember] =useState()

    const [alertChangeInfo, setAlertChangeInfo] = useState()

    // DRAFT JS
    const [editorState, setEditorState] = useState(() => {
      return EditorState.createEmpty()
    })

    const handleKeyCommand = (command) => {
      const newState = RichUtils.handleKeyCommand(editorState, command)
      if(newState){
        setEditorState(newState)
        return 'handled'
      }

      return 'not-handled'
    }
    const onUnderlineClick = () => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))
    }

    const onBoldClick = () => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
    }

    const onItalicClick = () => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
    }

    useEffect(() => {
        const res = projectService.getOneUserProject(projectId)
        res.then(value => {
            setProject(value.data.data)
            let i = 0
            setProjectMember(value.data.data.projectMember.map(project => {
              i++
              return(
              <CCard key={i} accentColor="info">
                <CCardBody>
                  {project}
                </CCardBody>
              </CCard>
              )
            }))
        })
    }, [])
    const changeProjectInfo = async() =>{
      const newDescription = convertToRaw(editorState.getCurrentContent())
      const newProjectInfo = {
        projectName: newProjectName,
        tag: newProjectTag,
        description: newDescription.blocks[0].text
      }
      const res = await projectService.changeProjectName(newProjectInfo, projectId)
     if(res.data.status === "OK"){
       history.push('/project')
     }else{
      setAlertChangeInfo(<CAlert color="danger">Project's name has already been used!</CAlert>)
     }
    }
    return(
        <>
        <CRow >
        <CCol xs="12" sm="6">
          <CCard accentColor="primary">
            <CCardHeader>
              <h3>Project Info</h3>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel><b>Project Name</b></CLabel>
                    <CInput placeholder={project.projectName} onChange={(e) => setNewProjectName(e.target.value)} />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol >
                  <CFormGroup>
                    <CLabel><b>Created at</b></CLabel>
                    <br/>
                    <CLabel>{project.createdAt}</CLabel>
                  </CFormGroup>
                </CCol>
                <CCol >
                  <CFormGroup>
                  <CLabel><b>Last Updated at</b></CLabel>
                    <br/>
                    <CLabel>{project.updatedAt}</CLabel>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel><b>Tag</b></CLabel>
                    <CInput placeholder={project.tag} onChange={(e) => setNewProjectTag(e.target.value)}/>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel><b>Description</b></CLabel>
                    <CButton onClick={onUnderlineClick}>U</CButton>
                    <CButton onClick={onBoldClick}><b>B</b></CButton>
                    <CButton onClick={onItalicClick}><em>I</em></CButton>
                    <hr/>
                      <Editor 
                      editorState={editorState} 
                      onChange={setEditorState} 
                      handleKeyCommand={handleKeyCommand}
                      placeholder = {project.description} /> 
                    <hr/>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
                <CRow className="justify-content-center">
                    <CButton size="lg" color = "primary" onClick={changeProjectInfo}>
                        Save Changes
                    </CButton>
                </CRow>
                <br/>
                <CRow className="justify-content-center">
                  {alertChangeInfo}
                </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="12" sm="6">
          <CCard accentColor="primary">
            <CCardHeader>
              <h3>Project Members</h3>
            </CCardHeader>
            <CCardBody>
            <CRow>
                <CCol xs="12">
                  <CFormGroup>
                  <CLabel><b>Project Manager</b></CLabel>
                    <br/>
                    <CLabel><h6>{project.manager}</h6></CLabel>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                  <CLabel><b>Other Members</b></CLabel>
                  {projectMember}
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        </CRow>
        </>
    )
}

export default ProjectInfo