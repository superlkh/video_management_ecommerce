import { 
    CButton, 
    CCard, 
    CCardBody, 
    CCardHeader, 
    CCol, 
    CRow,
    CFormGroup,
    CLabel,
    CInput,
    CSelect,
    CCardFooter,
    CModal,
    CModalBody,
    CModalHeader,
    CModalFooter,
    CInputGroup,
    CInputGroupPrepend,
    CContainer,
    CInputCheckbox
  } from '@coreui/react'

import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import invoiceService from 'src/services/invoice.service'


const CreditCard = (props) => {
    const invoiceid = props.match.params.invoiceId

    const [modalConfirm, setModalConfirm] = useState(false)

    const history = useHistory()

    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [month, setMonth] = useState('1')
    const [year, setYear] = useState('2017')
    const [cvc, setCvc] = useState('')


    const [checkNum, setCheckNum] = useState(0)

    const confirm = async(invoiceId) => {
      if (checkNum % 2 === 0){
        alert('Check the term and condition')
        return
      }
      const creditCard = {
        cardName: cardName,
        cardNumber: cardNumber,
        date: month + '/' + year,
        cvc: cvc,
        cost: 7
      }
      
        const res = await invoiceService.changeInvoiceStatus(invoiceId, 1, creditCard)
        if(res.data.status === 'OK'){
            alert('Success')
            history.push('/')
        } else {
            alert('failed')
        }
    }
    return(
        <>
        <CCard>
            <CCardHeader>
              Credit Card
              <small> Form</small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="name">Name</CLabel>
                    <CInput id="name" placeholder="Enter your name" required onChange={(e) => setCardName(e.target.value)}/>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="ccnumber">Credit Card Number</CLabel>
                    <CInput id="ccnumber" placeholder="0000 0000 0000 0000" required onChange={(e) => setCardNumber(e.target.value)}/>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="ccmonth">Month</CLabel>
                    <CSelect custom name="ccmonth" id="ccmonth" onChange={(e) => setMonth(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="ccyear">Year</CLabel>
                    <CSelect custom name="ccyear" id="ccyear" onChange={(e) => setYear(e.target.value)}>
                      <option>2017</option>
                      <option>2018</option>
                      <option>2019</option>
                      <option>2020</option>
                      <option>2021</option>
                      <option>2022</option>
                      <option>2023</option>
                      <option>2024</option>
                      <option>2025</option>
                      <option>2026</option>
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="cvv">CVV/CVC</CLabel>
                    <CInput id="cvv" placeholder="123" required onChange={(e) => setCvc(e.target.value)}/>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <CContainer>
              <CRow>
                {/* <form>
                  <input id="term" type="checkbox" onChange={() => setCheckNum(checkNum + 1)} />
              <CLabel for="term">I have read all the <a href='/#/terms-and-conditions' target='_blank'>terms and conditions</a></CLabel>
              </form> */}
              <CFormGroup variant="custom-checkbox" inline>
                <CInputCheckbox 
                  custom 
                  id="inline-checkbox1" 
                  name="inline-checkbox1"  
                  onChange={() => setCheckNum(checkNum + 1)}
                  />
                  <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">I have read all the <a href='/terms-and-conditions' target='_blank'>terms and conditions</a></CLabel>
              </CFormGroup>
              </CRow>
              <CRow>
                <CButton color = 'primary' onClick={() => {
                    setModalConfirm(true)
                }}>
                    Confirm
                </CButton>
                </CRow>
                </CContainer>
            </CCardFooter>
          </CCard>
          <CModal
            show={modalConfirm}
    onClose={() => {
      setModalConfirm(false)
    }}
    centered
    >
      <CModalHeader closeButton>Confirm to pay</CModalHeader>
      <CModalBody>
        Do you really sure you confirm to pay?
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={() => {
            confirm(invoiceid)
        }}>Yes</CButton>
        <CButton
          color="secondary"
          onClick={() => {
            setModalConfirm(false)
          }}
        >No</CButton>
        </CModalFooter>
    </CModal>
    </>
    )
}

export default CreditCard