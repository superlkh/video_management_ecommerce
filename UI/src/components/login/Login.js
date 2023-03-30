import React, { useState } from 'react'
import { useHistory } from 'react-router'
// import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
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
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
// Thư viện cần thiết cho validation
// Chi tiết: https://react-hook-form.com/
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import subscription from 'src/config/webPush.config'

const Login = () => {

  const [failedLogIn, setfailedLogIn] = useState(null)

  let history = useHistory()
  // const selector = useSelector(state => state)
  // const dispatch = useDispatch()

  // Khai báo object ràng buộc cho validate 
  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .required('Password is required')
  })

  // Khai báo các biến cần thiết cho validate
  // Chi tiết API: https://react-hook-form.com/api/useform
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // const [userName, setUserName] = useState('')
  // const [passWord, setPassWord] = useState('')

  // Hàm gửi request đăng nhập đến API
  async function sendSignInRequest(validatedData) {

    const pushSub =  await subscription()
    if(pushSub){
      validatedData.pushSub = pushSub
    }

    const res = await axios.post('http://localhost:5000/api/auth/signin', validatedData)

    return res
  }

  // Nhận data đã được validate, gửi data đến API và xử lý response
  const onSubmit = async (signInData) => {

    // Gửi request đăng nhập đến API, nhận về response
    const resObj = await sendSignInRequest(signInData)

    // Xử lý kết quả response
    
      // Response status = OK thì chuyển về trang Home
      if (resObj.data.status === 'OK') {
      
        // Lưu token vào local storage
        localStorage.setItem('X-Auth-Token', resObj.data.data.accessToken)
        localStorage.setItem('Username', resObj.data.data.username)
        localStorage.setItem('UserId', resObj.data.data.id)

        // dispatch({type: 'log_in', X_Auth_Token: resObj.data.accessToken}
        history.push('/')
      } else if (resObj.data.status === 'INVALID_REQUEST') {
        // Response status != OK thì hiện thông báo
        setfailedLogIn(<CAlert color="danger">Wrong username or password</CAlert>)
      } else {
        setfailedLogIn(<CAlert color="danger">Something's wrong happened!</CAlert>)
      }
    

  }

  const forgotPassword = () => {
    history.push('/enterUsername')
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {/* Xử lý handleSubmit đã khai báo của hook useForm, xem API của useForm để biết thêm chi tiết */}
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      {/* Input username,  {...register("username")} nhận về kết quả thay đổi của username*/}
                      <input type="text" placeholder="Username" autoComplete="username" {...register("username")}
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                      {/* Chỉ hiển thị khi username vi phạm ràng buộc đã được khai báo trong validationSchema */}
                      <div className="invalid-feedback">{errors.username?.message}</div>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <input type="password" placeholder="Password" autoComplete="current-password" {...register("password")}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </CInputGroup>
                    {failedLogIn}
                    <CRow>
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0" onClick={forgotPassword}>Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <br />
                    <p>Don't have an account? Sign up now!</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login