import React from 'react'
import axios from 'axios';
import {
    CBadge,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
// import GoogleLogin from 'react-google-login';
// import { useHistory } from 'react-router-dom';
// import { google } from 'googleapis'

const TheHeaderDropdown = () => {
    // const history = useHistory()

    // const ClientId = "1013482357476-31g4c3v986hfthcinktm3vmnrd28ccfk.apps.googleusercontent.com";
    // const ClientSecret = "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";
    // const RedirectionUrl = "http://localhost:3003/oauthCallback";
    // const oauth2Client = new google.auth.OAuth2(ClientId, ClientSecret, RedirectionUrl);

    // const scopes = [
    //   'https://www.googleapis.com/auth/drive.file'
    // ];

    // const url = oauth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: scopes
    // });

    // const handleLogin = (googleData) => {
    //   console.log(googleData)
    //   //localStorage.setItem('loginData', JSON.stringify(data));
    // }
    // const handleFailure = (result) => {
    //   console.log('co loi')
    //   alert(result);
    // }
 
    const connectGoogleAccount = async () => {
        // const res = await axios({
        //   method: 'get',
        //   url: `http://localhost:5000/user/connectGoogleDrive`,
        //   headers: {
        //     'x-access-token': localStorage.getItem('X-Auth-Token')
        //   }
        // })

        // if (res.data.status === 'OK') {
        //   console.log(res.data.data.url)
        //   history.push(res.data.data.url)
        // }
        window.open("http://localhost:5000/user/connectGoogleDrive", "_self");
    }


    return (
        <CDropdown
            inNav
            className="c-header-nav-items mx-2"
            direction="down"
        >
            <CDropdownToggle className="c-header-nav-link" caret={false}>
                <div className="c-avatar">
                    <CImg
                        src={'avatars/6.jpg'}
                        className="c-avatar-img"
                        alt="admin@bootstrapmaster.com"
                    />
                </div>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownItem
                    header
                    tag="div"
                    color="light"
                    className="text-center"
                >
                    <strong>Account</strong>
                </CDropdownItem>

                <CDropdownItem onClick={connectGoogleAccount}>
                    {/* <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
          ></GoogleLogin> */}
                    <a>Sign in google</a>
                </CDropdownItem>

                <CDropdownItem
                    header
                    tag="div"
                    color="light"
                    className="text-center"
                >
                    <strong>Settings</strong>
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-user" className="mfe-2" />Profile
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-settings" className="mfe-2" />
                    Settings
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-credit-card" className="mfe-2" />
                    Payments
                    <CBadge color="secondary" className="mfs-auto">42</CBadge>
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-file" className="mfe-2" />
                    Projects
                    <CBadge color="primary" className="mfs-auto">42</CBadge>
                </CDropdownItem>
                <CDropdownItem divider />
                <CDropdownItem>
                    <CIcon name="cil-lock-locked" className="mfe-2" />
                    Lock Account
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default TheHeaderDropdown
