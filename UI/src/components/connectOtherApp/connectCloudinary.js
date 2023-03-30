import React, { useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
// Thư viện cần thiết cho validation
// Chi tiết: https://react-hook-form.com/
import { useForm } from "react-hook-form"                  
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import userServices from 'src/services/user.service'

const ConnectCloudinary = () => {

    const [notify, setNotify] = useState(null)

    const validationSchema = yup.object().shape({
        cloudName: yup.string(),
            // .required('Current password is required')
            // .min(6, 'Current password must be at least 6 characters')
            // .max(40, 'Current password must not exceed 40 characters'),
        apiKey: yup.string(),
            // .required('Password is required')
            // .min(6, 'Password must be at least 6 characters')
            // .max(40, 'Password must not exceed 40 characters'),
        apiSecret: yup.string()
            // .required('Confirm Password is required')
            // .oneOf([yup.ref('password'), null], 'Confirm Password does not match')
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (registrationData) => {
        console.log('submit')
        const res = await userServices.connectCloudinary(registrationData)
        if (res.data.status === 'OK') {
            setNotify(<CAlert className='mt-2 mb-3' color="success">Connect cloudinary successfully</CAlert>)
        } else if (res.data.status === 'INVALID_REQUEST') {
            setNotify(<CAlert className='mt-2 mb-3' color="danger">Information is not valid</CAlert>)
        } else {
            setNotify(<CAlert className='mt-2 mb-3' color="danger">There are some errors</CAlert>)
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
                                    <h1>Connect to cloudinary</h1>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cilCloud" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <input type="password" placeholder="Your cloud name" autoComplete="new-password" {...register("cloudName")}
                                            className={`form-control ${errors.cloudName ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.cloudName?.message}</div>
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <input type="password" placeholder="Your api key" autoComplete="new-password" {...register("apiKey")}
                                            className={`form-control ${errors.apiKey ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.apiKey?.message}</div>
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <CIcon name="cil-qr-code" />
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <input type="password" placeholder="Your api secret" autoComplete="new-password" {...register("apiSecret")}
                                            className={`form-control ${errors.apiSecret ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.apiSecret?.message}</div>
                                    </CInputGroup>
                                    {notify}
                                    <CButton type="submit" color="success" block>Connect</CButton>
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

export default ConnectCloudinary
