import { 
    CButton, 
    CCard, 
    CCardBody, 
    CCardHeader, 
    CCol, 
    CRow 
} from '@coreui/react'
import React from 'react'
import { useHistory } from 'react-router'
import invoiceService from 'src/services/invoice.service'

const Pricing = () => {
    const history = useHistory()

    const addInvoice = async(pricingId) => {
        if(!localStorage.getItem('X-Auth-Token')){
            history.push('/login')
        }
        
        const res = await invoiceService.addInvoice(pricingId)

        if(res.data.status === 'OK'){
            history.push(`/pricing/invoice/${res.data.data.uuid}`)
        }
    }

    return(
        <>
            <CRow className="justify-content-center">
                <h1>Pricing</h1>
            </CRow>
            <br/>
            <CRow>
                <CCol >
                    <CCard className="text-center">
                        <CCardHeader color="secondary">
                           <h3>Normal</h3>
                        </CCardHeader>
                        <CCardBody>
                            <h3>Free</h3>
                            <br/>
                            <h3>5 GB storage</h3>
                            <br/>
                            Many features
                            <br/>
                            <CButton size="lg" variant="outline" shape='pill' color='secondary' onClick={async() => {
                                await addInvoice(1)
                            }}>Let's go</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className="text-center">
                        <CCardHeader color="info" className='text-white '>
                            <h3>Pro</h3>
                        </CCardHeader>
                        <CCardBody>
                            <h3>10<sup>$</sup>/month</h3>
                            <br/>
                            <h3>20 GB storage</h3>
                            <br/>
                            Full features
                            <br/>
                            <CButton size="lg" variant="outline" shape='pill' color='info' onClick={async() => {
                                await addInvoice(2)
                            }}>Let's go</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard className="text-center">
                        <CCardHeader color='primary' className='text-white '>
                            <h3>Enterprise</h3>
                        </CCardHeader>
                        <CCardBody>
                            <h3>20<sup>$</sup>/month</h3>
                            <br/>
                            <h3>50 GB storage</h3>
                            <br/>
                            Full features
                            <br/>
                            <CButton size="lg" variant="outline" shape='pill' color='primary' onClick={async() => {
                                await addInvoice(3)
                            }}>Let's go</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Pricing