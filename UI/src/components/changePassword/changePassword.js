import React, { useState } from 'react'
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

import userServices from 'src/services/user.service'

const ChangePassword = () => {

    const [notify, setNotify] = useState(null)

    const validationSchema = yup.object().shape({
        currentPassword: yup.string()
            .required('Current password is required')
            .min(6, 'Current password must be at least 6 characters')
            .max(40, 'Current password must not exceed 40 characters'),
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
        const res = await userServices.changePassword(registrationData)
        if (res.data === true) {
            setNotify(<CAlert className='mt-2 mb-3' color="success">Change password successfully</CAlert>)
        } else {
            setNotify(<CAlert className='mt-2 mb-3' color="danger">Current password is not correct</CAlert>)
        }
    }

    return (
        <div >
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
                                        <input type="password" placeholder="Current password" autoComplete="new-password" {...register("currentPassword")}
                                            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.currentPassword?.message}</div>
                                    </CInputGroup>
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
                                    {notify}
                                    <CButton type="submit" color="success" block>Change password</CButton>
                                </CForm>
                                <br />
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default ChangePassword
