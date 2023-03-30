import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import CIcon from '@coreui/icons-react'

import invoiceService from 'src/services/invoice.service'

import { 
    CButton,
    CCard, 
    CCardBody, 
    CCardHeader, 
    CPagination,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
  } from '@coreui/react'



const InvoiceHistory = () => {

    const history = useHistory()

    const [invoices, setInvoices] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [countPages, setCountPages] = useState(1)
    const [pageHidden, setPageHidden] = useState(true)

    const [modalConfirm, setModalConfirm] = useState(false)
    const [currentInvoiceId, setCurrentInvoiceId] = useState()

    useEffect(async() => {
       await getInvoices(currentPage)
    }, [])

    const getInvoices = async(page) => {
        const res = await invoiceService.getInvoices(page)
        if(res.data.status === 'OK'){
            if(parseInt(res.data.data.count) % 5 !== 0){
                setCountPages(Math.round(parseInt(res.data.data.count) / 5 + 0.5))
            } else {
                setCountPages(Math.round(parseInt(res.data.data.count) / 5))
            }

            setInvoices([...res.data.data.rows])

            if(res.data.data.count > 5){
                setPageHidden(false)
            } else {
                setPageHidden(true)
            }
        }
    }

    const cancelInvoice = async(invoiceId) => {
        const res = await invoiceService.changeInvoiceStatus(invoiceId, -1)
        if(res.data.status === 'OK'){
            setModalConfirm(false)
            await getInvoices(currentPage)
        } else {
            alert('Failed')
        }
    }

    const pageChange = async(i) => {
        setCurrentPage(i)
        await getInvoices(i)
    }

    if(!invoices){
        return null
    }
    return(
        <>
        <CCard>
        <table className="table table-hover table-outline mb-0 d-none d-sm-table">
        <thead className="thead-light">
          <tr>
            <th className="text-center">#</th>
            <th>Item</th>
            <th className="text-center">Confirm Paid</th>
            <th className="text-center">Payment Day</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
       {invoices.map((invoice, i) => {
           let item = ''
           let status = 'Waiting...'
           let payDay = ''
           let hideDelete = false
           if(invoice.pricingId === '2'){
               item = 'Pro Package'
           } else if (invoice.pricingId === '3'){
               item = 'Enterprise Package'
           }
           if(invoice.status === 1){
               payDay = invoice.updatedAt
               status = <CIcon name="cil-check" className='text-success'/>
               hideDelete = true
            } else if (invoice.status === -1){
                payDay = 'Cancelled'
                status = <CIcon name="cil-x" className='text-danger'/>
                hideDelete = true
            }

           
           return(
            <tr key={i}>
            <td className="text-center">
                <div>
                    {i + 1}
                </div>
            </td>
            <td>
                <div>{item}</div>
                <div className="small text-muted">
                    Created at: {invoice.createdAt} 
                </div>
            </td>
            <td className="text-center">
                {status}
            </td>
            <td>
                <div className="text-center">{payDay}</div>
            </td>
            <td className="text-center">
                <CButton color="info" onClick={() => {
                    history.push(`/pricing/invoice/${invoice.uuid}`)
                }}>View</CButton>
                <CButton hidden={hideDelete} color="secondary" onClick={() => {
                    setCurrentInvoiceId(invoice.uuid)
                   setModalConfirm(true)
                }}>Cancel</CButton>
            </td>
         </tr>
           )
       })}
       </tbody>
       </table>
       </CCard>
       
       <CPagination
       hidden={pageHidden}
        activePage={currentPage}
        pages={countPages}
        onActivePageChange={pageChange}
        ></CPagination>
        <CModal
            show={modalConfirm}
            onClose={() => {
            setModalConfirm(false)
            }}
            centered
        >
        <CModalHeader closeButton>Confirm cancel</CModalHeader>
        <CModalBody>
            Do you really want to cancel this invoice?
        </CModalBody>
        <CModalFooter>
        <CButton color="secondary" onClick={() => {
          cancelInvoice(currentInvoiceId)
        }}>Yes</CButton>{' '}
        <CButton
          color="primary"
          onClick={() => {
            setModalConfirm(false)
          }}
        >No</CButton>
        </CModalFooter>
        </CModal>
    </>
    )
}
    

export default InvoiceHistory