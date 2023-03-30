import axios from 'axios'

const checkUserNameExist = (userName) => {
    return axios.get(`http://localhost:5000/api/auth/checkUserName`, { params: { userName } })
}

const sendOtp = (userName) => {
    axios.get(`http://localhost:5000/api/auth/sendOtp`, { params: { userName } })
}

const confirmOtp = (otp, userName) => {
    return axios.get(`http://localhost:5000/api/auth/confirmOtp`, { params: { otp, userName } })
}

const changePassword = (userName, registrationData) => {
    return axios.post(`http://localhost:5000/api/auth/changePassword`, { 
        userName,
        ...registrationData
    })
}

const forgotPasswordService = {
    checkUserNameExist,
    sendOtp,
    confirmOtp,
    changePassword
}

export default forgotPasswordService