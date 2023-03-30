import React, { useState } from 'react'
import { useHistory } from 'react-router'
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCol,
    CContainer,
    CForm,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
// Thư viện cần thiết cho validation
// Chi tiết: https://react-hook-form.com/
import { useForm } from "react-hook-form"                    // Hook
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import forgotPasswordService from 'src/services/forgotPassword.service'

const EnterNewPassword = (props) => {

    const [failedRegister, setfailedRegister] = useState(null)

    const userName = props.match.params.userName
    const history = useHistory()

    const validationSchema = yup.object().shape({
        password: yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters'),
        confirmPassword: yup.string()
            .required('Confirm Password is required')
            .oneOf([yup.ref('password'), null], 'Confirm Password does not match')
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (registrationData) => {
        console.log('submit')
        const res = await forgotPasswordService.changePassword(userName, registrationData)
        history.push('/login')
    }

    return (
        <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="9" lg="7" xl="6">
                        <CCard className="mx-4">
                            <CCardBody className="p-4">
                                {/* Xử lý handleSubmit đã khai báo của hook useForm, xem API của useForm để biết thêm chi tiết */}
                                <CForm onSubmit={handleSubmit(onSubmit)} >
                                    <h1>Change password</h1>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <input type="password" placeholder="Password" autoComplete="new-password" {...register("password")}
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.password?.message}</div>
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <input type="password" placeholder="Repeat password" autoComplete="new-password" {...register("confirmPassword")}
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                                    </CInputGroup>
                                    <CButton type="submit" color="success" block>Change password</CButton>
                                </CForm>
                                <br />
                                {failedRegister}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default EnterNewPassword