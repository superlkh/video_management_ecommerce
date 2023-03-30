import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CCol, 
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter 
} from '@coreui/react'

import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import invoiceService from 'src/services/invoice.service'
import userServices from 'src/services/user.service'


const Invoice = (props) => {
  const history = useHistory()
  const invoiceId = props.match.params.invoiceId

  const [invoiceInfo, setInvoiceInfo] = useState()
  const [pricing, setPricing] = useState()
  const [user, setUser] = useState()
  const [modalConfirm, setModalConfirm] = useState(false)

  const [hiddenPayButton, setHiddenPayButton] = useState(false)

  const day = new Date()

  useEffect(async() => {
    const resUser = await userServices.getOneUser()
    if(resUser.data.status === 'OK'){
      setUser(resUser.data.data)
    }

    const res = await invoiceService.getOneInvoice(invoiceId)
    if(res.data.status === 'OK'){
      setInvoiceInfo({...res.data.data.invoice})
      setPricing({...res.data.data.pricing})
      if(res.data.data.invoice.status === -1 || res.data.data.invoice.status === 1){
        setHiddenPayButton(true)
      }

    } else {
      history.push('/')
    }
  }, [])

  if(!pricing || !invoiceInfo || !localStorage.getItem('X-Auth-Token')){
    return null
  }

  let color = ''
  let classText = 'text-center'
  if(pricing.id === '1'){
    color = 'secondary'
  } else if(pricing.id === '2'){
    color = 'info'
    classText += ' text-white'
  } else if(pricing.id === '3'){
    color = 'primary'
    classText += ' text-white'
  }

  const subtotal = pricing.price
  const discount = subtotal * 20 / 100
  const vat = subtotal * 10 / 100
  const total = subtotal - discount - vat
  return(
    <>
      <CRow>
          <CCol lg='8'>
            <CCard>
              <CCardHeader>Invoice
    {/* <strong>#90-98792</strong> */}
    {/* <a className="btn btn-sm btn-secondary float-right mr-1 d-print-none" href="#" onClick="javascript:window.print();">
      <i className="fa fa-print"></i> Print</a>
    <a className="btn btn-sm btn-info float-right mr-1 d-print-none" href="#">
      <i className="fa fa-save"></i> Save</a> */}
              </CCardHeader>
              <CCardBody>
              <div className="row mb-4">
      <div className="col-sm-4">
        <h6 className="mb-3">From:</h6>
        <div>
          <strong>Manage Video for Ecommerce</strong>
        </div>
        <div>Mr. Huy</div>
        <div>Ho Chi Minh City, Vietnam</div>
        <div>Email: grandmaster@evideo.com</div>
        <div>Phone: +84 38 757 8517</div>
      </div>
      {/* <!-- /.col--> */}
      <div className="col-sm-4">
        <h6 className="mb-3">To:</h6>
        <div>
          <strong>{user.username}</strong>
        </div>
        {/* <div>Tu Tai</div> */}
        {/* <div>Ha Noi, Vietnam</div> */}
        <div>Email: {user.email}</div>
        <div>Phone: {user.phone}</div>
      </div>
      {/* <!-- /.col--> */}
      <div className="col-sm-4">
        <h6 className="mb-3">Details:</h6>
        <div>Invoice
          {/* <strong>#90-98792</strong> */}
        </div>
        <div>Date and Time: 
          <div>
          {invoiceInfo.createdAt}
          </div>
          </div>
        {/* <div>VAT: PL9877281777</div>
        <div>Account Name: BootstrapMaster.com</div>
        <div>
          <strong>SWIFT code: 99 8888 7777 6666 5555</strong>
        </div> */}
      </div>
      {/* <!-- /.col--> */}
    </div>
    {/* <!-- /.row--> */}
    <div className="table-responsive-sm">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="center">#</th>
            <th>Item</th>
            <th>Description</th>
            <th className="center">Quantity</th>
            <th className="right">Unit Cost</th>
            <th className="right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="center">1</td>
            <td className="left">{pricing.pricingName} Package</td>
            <td className="left">{pricing.storage} GB storage</td>
            <td className="center">1</td>
            <td className="right">${pricing.price}</td>
            <td className="right">${pricing.price}</td>
          </tr>

        </tbody>
      </table>
    </div>
    
    <div className="row">
      {/* <div className="col-lg-4 col-sm-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div> */}
      <div className="col-lg-4 col-sm-5 ml-auto">
        <table className="table table-clear">
          <tbody>
            <tr>
              <td className="left">
                <strong>Subtotal</strong>
              </td>
              <td className="right">${subtotal}</td>
            </tr>
            <tr>
              <td className="left">
                <strong>Discount (20%)</strong>
              </td>
              <td className="right">${discount}</td>
            </tr>
            <tr>
              <td className="left">
                <strong>VAT (10%)</strong>
              </td>
              <td className="right">${vat}</td>
            </tr>
            <tr>
              <td className="left">
                <strong>Total</strong>
              </td>
              <td className="right">
                <strong>${total}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol lg>
  <CRow>
  <CCard className="text-center">
    <CCardHeader className='text-white' color={color}>
        <h3>{pricing.pricingName}</h3>
    </CCardHeader>
    <CCardBody>
        <h3>{pricing.price}<sup>$</sup></h3>
        <br/>
        <h3>{pricing.storage} GB storage</h3>
        <br/>
        Many features
        <br/>
    </CCardBody>
        </CCard>
        </CRow>
        <CRow>
        <CButton hidden={hiddenPayButton} size='lg' color='primary' onClick={() => {
          setModalConfirm(true)
        }}>Proceed to Payment</CButton>
        </CRow>
        </CCol>
  </CRow>
  <CModal
    show={modalConfirm}
    onClose={() => {
      setModalConfirm(false)
    }}
    centered
    >
      <CModalHeader closeButton>Confirm proceed to payment</CModalHeader>
      <CModalBody>
        Do you really want to proceed to payment?
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={() => {
          console.log('Clicked')
          history.push(`/pricing/invoice/payment/${invoiceId}`)
        }}>Yes</CButton>{' '}
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

export default Invoice