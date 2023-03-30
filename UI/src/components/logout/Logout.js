import React, {useState} from 'react'
import {
    CButton,
    CModal, 
    CModalFooter,
    CModalHeader
} from '@coreui/react'
import { useHistory } from 'react-router';

import subscription from 'src/config/webPush.config'

const Logout = () => {
    const history = useHistory()
    const [modal, setModal] = useState(true);

    const token = localStorage.getItem('X-Auth-Token')
    if(!token){
        return null
    }

    const toggle = ()=>{
        setModal(!modal);
        history.push('/')
    }

    const logOut = async() => {
        await subscription()
        localStorage.removeItem('X-Auth-Token')
        history.push('/login')
    }

    return(
        <CModal
        show={modal}
        onClose={toggle}
      >
        <CModalHeader closeButton>Do you really want to log out?</CModalHeader>
        <CModalFooter>
          <CButton color="sencondary" onClick={logOut}>Yes</CButton>{' '}
          <CButton
            color="primary"
            onClick={toggle}
          >No</CButton>
        </CModalFooter>
      </CModal>
    )
}

export default Logout