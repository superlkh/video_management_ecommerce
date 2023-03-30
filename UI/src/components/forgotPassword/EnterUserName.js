import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react'

import forgotPasswordService from '../../services/forgotPassword.service'


const EnterUserName = () => {

    const [userNameExist, setUserNameExist] = useState(true)
    const [userName, setUserName] = useState('')
    const [notice, setNotice] = useState(false)

    const history = useHistory()

    const handleChange = (e) => {
        setNotice(false)
        setUserName(e.target.value)
    }

    const checkUserName = async () => {
        const res = await forgotPasswordService.checkUserNameExist(userName)
        if (res.data.status === 'OK') {
            if (res.data.data.isExist) {
                setUserNameExist(res.data.data.isExist)
                forgotPasswordService.sendOtp(userName)
                history.push(`/enterOTP/${userName}`)
            } else {
                setNotice(true)
                setUserNameExist(res.data.data.isExist)
            }
        }
    }

    return (
        <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="4">
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <h3>Please enter your username</h3>
                                    <CInput className='mt-3' type='text' placeholder='Enter username ...' defaultValue={userName}
                                        onChange={handleChange}></CInput>
                                    {
                                        notice ? (userName === '' ? (<CAlert className='mt-2 mb-1' color="danger">Please enter username</CAlert>) :
                                            (!userNameExist && <CAlert className='mt-2 mb-1' color="danger">Username is not exist</CAlert>)) : ''
                                    }
                                    <CButton color='info' className='mt-3' onClick={checkUserName}>Continue</CButton>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default EnterUserName