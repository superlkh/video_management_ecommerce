import React, { lazy, useEffect, useState } from 'react'
import {
	CAlert,
	CCard,
	CCol,
	CProgress,
	CRow,
	CDropdown,
	CWidgetDropdown,
	CDropdownToggle,
	CDropdownItem,
	CDropdownMenu,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import GoogleLogin from 'react-google-login';

import ChartLineSimple from 'src/views/charts/ChartLineSimple'
import ChartBarSimple from 'src/views/charts/ChartBarSimple'

// import MainChartExample from '../../views/charts/MainChartExample.js'

import userServices from 'src/services/user.service.js'


// const WidgetsDropdown = lazy(() => import('../../views/widgets/WidgetsDropdown.js'))
// const WidgetsBrand = lazy(() => import('../../views/widgets/WidgetsBrand.js'))

const Dashboard = () => {

	const [dashBoard, setDashBoard] = useState({})
	const [loginData, setLoginData] = useState(null)
	const [urlConnectGoogleAccount, setUrlConnectGoogleAccount] = useState(null)
	// token đăng nhập
	const token = localStorage.getItem('X-Auth-Token')
	let user = ''

	useEffect(async () => {
		await userServices.updateUserStorage()
		const res = await userServices.userDashBoard()
		if (res.data.status === 'OK') {
			setDashBoard({ ...res.data.data })
		}

		// load xem user co login google account
		const res2 = await axios({
			method: 'GET',
			url: 'http://localhost:5000/user/google/status',
			headers: {
				'x-access-token': localStorage.getItem('X-Auth-Token')
			}
		})
		if(res.data.data) {
			if (res2.data.data.isLogin === true) {
				setLoginData(res2.data.data.result)
			}
		}  
		

		// get url de connect google account
		const res3 = await axios({
			method: 'GET',
			url: 'http://localhost:5000/connect/google/getUrl',
			headers: {
				'x-access-token': localStorage.getItem('X-Auth-Token')
			}
		})
		if (res3.data.status === 'OK') {
			setUrlConnectGoogleAccount(res3.data.data.url)
		}

		return () => {
			setDashBoard({})
		}
	}, [])

	const handleFailure = (result) => {
		console.log('co loi')
		alert(result);
	};

	const handleLogin = async (accountInfo) => {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:5000/user/connectGoogleAccount',
			data: {
				accountInfo
			},
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('X-Auth-Token')
			},
		});

		const data = await res.data.data
		setLoginData(data);
	};

	const handleLogout = async () => {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:5000/connect/google/logout',
			headers: {
				'x-access-token': localStorage.getItem('X-Auth-Token')
			},
		});
		if (res.data.status === 'OK') {
			setLoginData(null);
		}
	};

	// Kiểm tra có đăng nhập hay không
	if (token) {
		// Có thì xuất ra màn hình
		user = <CAlert color="info">Welcome, <b> {localStorage.getItem('Username')} </b></CAlert>
	}
	if (!dashBoard || !token) {
		return null
	}
	return (
		<>
			{user}

			{/* {loginData ? (
				<div>
					<h3>You logged in as {loginData.email}</h3>
					<button onClick={handleLogout}>Logout</button>
				</div>
			) : (
				<GoogleLogin
					clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
					buttonText="Log in with Google"
					onSuccess={handleLogin}
					onFailure={handleFailure}
					cookiePolicy={'single_host_origin'}
					onClick={()=>{alert('click')}}
				></GoogleLogin>
			)} */}
			{loginData ? (
				<div>
					<h3>Xin chào {loginData.name}</h3>
					<button onClick={handleLogout}>Logout</button>
				</div>
			) : (

				<a href={urlConnectGoogleAccount} >Login with google</a>
			)}
			< CRow className="mt-3">
				<CCol>
					<CWidgetDropdown
						color="gradient-primary"
						header={dashBoard.project}
						text="Number of projects"
						footerSlot={
							<ChartLineSimple
								pointed
								className="c-chart-wrapper mt-3 mx-3"
								style={{ height: '70px' }}
								dataPoints={[65, 59, 84, 84, 51, 55, 40]}
								pointHoverBackgroundColor="primary"
								label="Projects"
								labels="months"
							/>
						}
					>
					</CWidgetDropdown>
				</CCol>

				<CCol>
					<CWidgetDropdown
						color="gradient-info"
						header={dashBoard.folder}
						text="Number of folders"
						footerSlot={
							<ChartLineSimple
								pointed
								className="mt-3 mx-3"
								style={{ height: '70px' }}
								dataPoints={[1, 18, 9, 17, 34, 22, 11]}
								pointHoverBackgroundColor="info"
								options={{ elements: { line: { tension: 0.00001 } } }}
								label="Folders"
								labels="months"
							/>
						}
					>
					</CWidgetDropdown>
				</CCol>

				<CCol>
					<CWidgetDropdown
						color="gradient-warning"
						header={dashBoard.video}
						text="Number of videos"
						footerSlot={
							<ChartLineSimple
								className="mt-3"
								style={{ height: '70px' }}
								backgroundColor="rgba(255,255,255,.2)"
								dataPoints={[78, 81, 80, 45, 34, 12, 40]}
								options={{ elements: { line: { borderWidth: 2.5 } } }}
								pointHoverBackgroundColor="warning"
								label="Videos"
								labels="months"
							/>
						}
					>
					</CWidgetDropdown>
				</CCol>

				<CCol>
					<CWidgetDropdown
						color="gradient-danger"
						header={dashBoard.image}
						text="Number of images"
						footerSlot={
							<ChartBarSimple
								className="mt-3 mx-3"
								style={{ height: '70px' }}
								backgroundColor="rgb(250, 152, 152)"
								label="Images"
								labels="months"
							/>
						}
					>
					</CWidgetDropdown>
				</CCol>

				<CCol>
					<CWidgetDropdown
						color="gradient-success"
						header={dashBoard.usage + '%'}
						text="Usage"
						footerSlot={
							<ChartLineSimple
								className="mt-3"
								style={{ height: '70px' }}
								backgroundColor="rgba(255,255,255,.2)"
								dataPoints={[78, 81, 80, 45, 34, 12, 40]}
								options={{ elements: { line: { borderWidth: 2.5 } } }}
								pointHoverBackgroundColor="warning"
								label="Usage"
								labels="months"
							/>
						}
					>
					</CWidgetDropdown>
				</CCol>
			</CRow>
		</>
	)
}

export default Dashboard
