import React, {useState} from 'react'
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
import axios from 'axios'
// Thư viện cần thiết cho validation
// Chi tiết: https://react-hook-form.com/
import { useForm } from "react-hook-form"                    // Hook
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import subscription from 'src/config/webPush.config'


const Register = () => {

  const [failedRegister, setfailedRegister] = useState(null)

  let history = useHistory()

  // Khai báo object ràng buộc cho validate 
  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: yup.string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Confirm Password does not match')
  })

  // Khai báo các biến cần thiết cho validate
  // Chi tiết API: https://react-hook-form.com/api/useform
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(validationSchema)
  })
  
  // const [userName, setUserName] = useState('')
  // const [Email, setEmail] = useState('')
  // const [passWord, setPassWord] = useState('')
  // const [rePassWord, setRePassWord] = useState('')

  // Hàm gửi request đăng ký đến API
  async function sendSignUpRequest(validatedData){
    
    const promise = await axios.post('http://localhost:5000/api/auth/signup', validatedData)

    return promise
  }
  
  // Nhận data đã được validate, gửi data đến API và xử lý response
  const onSubmit = async(registrationData) => {

    // Gửi request đăng ký đến API, nhận về response
    const result = await sendSignUpRequest(registrationData)
    console.log(result)
    // Xử lý kết quả response
      // Response status = OK thì chuyển về trang login
      if(result.data.status === 'OK'){
        console.log('Register successfully')
        history.push('/login')
      } else {
      // Response status != OK thì hiện thông báo
        setfailedRegister(<CAlert color = "danger">Username or email is already used!</CAlert>)
      }
  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {/* Xử lý handleSubmit đã khai báo của hook useForm, xem API của useForm để biết thêm chi tiết */}
                <CForm onSubmit = {handleSubmit(onSubmit)} >
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    {/* Input username,  {...register("username")} nhận về kết quả thay đổi của username*/}
                    <input type="text" placeholder="Username" autoComplete="username" {...register("username")}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}/>
                    {/* Chỉ hiển thị khi username vi phạm ràng buộc đã được khai báo trong validationSchema */}
                    <div className="invalid-feedback">{errors.username?.message}</div>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <input type="text" placeholder="Email" autoComplete="email" {...register("email")}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <input type="password" placeholder="Password" autoComplete="new-password" {...register("password")} 
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <input type="password" placeholder="Repeat password" autoComplete="new-password" {...register("confirmPassword")} 
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}/>
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </CInputGroup>
                  <CButton type="submit" color="success" block>Create Account</CButton>
                </CForm>
                <br />
                {failedRegister}
              </CCardBody>
              <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-facebook mb-1" block><span>facebook</span></CButton>
                  </CCol>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-twitter mb-1" block><span>twitter</span></CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register