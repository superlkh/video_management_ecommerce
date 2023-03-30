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
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import forgotPasswordService from 'src/services/forgotPassword.service'

const EnterOTP = (props) => {

    const [otp, setOtp] = useState(null)
    const [isValidOtp, setIsValidOtp] = useState(3)

    const userName = props.match.params.userName
    const history = useHistory()

    const handleChange = (e) => {
        setOtp(e.target.value)
    }

    const handleClick = async () => {
        const res = await forgotPasswordService.confirmOtp(otp, userName)
        if (res.data.status === 'OK') {
            setIsValidOtp(res.data.data.message)
            if (res.data.data.message === 3) {
                history.push(`/enterNewPassword/${userName}`)
            }
        }
    }

    const resendOtp = async () => {
        forgotPasswordService.sendOtp(userName)
        // set de reload lai trang nay
        setIsValidOtp(3)
    }

    return (
        <div className="c-app c-default-layout flex-row">
            <CContainer style={{ marginTop: '100px' }}>
                <CRow className="justify-content-center" >
                    <CCol className='text-center col-4 bg-info' style={{ padding: '40px 0' }}>
                        <h3>OTP Authentication</h3>
                        <h5 style={{ padding: '20px 0' }}>Your otp password is sent to your mail. Please enter otp within 20s</h5>
                        <CButton size="xl" className="btn-facebook btn-brand mr-1 mb-1" onClick={resendOtp}>
                            <CIcon size="xl" name="cilReload" /><span className="mfs-2">Resend OTP</span>
                        </CButton>
                        <CInput type="text" style={{ width: '80%', margin: '20px auto' }}
                            placeholder="Enter your OTP"
                            onChange={handleChange}></CInput>
                        {
                            isValidOtp === 3 ? '' :
                                (
                                    isValidOtp === 1 ?
                                        <CAlert style={{ width: '80%', margin: '20px auto' }} className='mt-2 mb-1' color="danger">
                                            OTP is expired
                                        </CAlert> :
                                        <CAlert style={{ width: '80%', margin: '20px auto' }} className='mt-2 mb-1' color="danger">
                                            OTP is not correct
                                        </CAlert>
                                )
                        }
                        <CButton className='bg-primary'
                            style={{ width: '50%', margin: '20px auto' }}
                            onClick={handleClick}>Continue</CButton>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default EnterOTP