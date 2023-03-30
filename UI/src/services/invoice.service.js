import axios from 'axios'
import api from 'src/config/api.config'
import projectService from './project.service'
import notificationService from './notification.service'
import notifConfig from '../config/notification.config'

const getInvoices = async(page) => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/invoices`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        params: {
            page: page
        }
    })

    return res
}

const getOneInvoice = async(invoiceId) => {
    const res = await axios({
        method: 'get',
        url: `${api.url}/api/invoices/${invoiceId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
    })

    return res
}

const addInvoice = async(pricingId) => {
    const res = await axios({
        method: 'post',
        url: `${api.url}/api/invoices`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        data: {
            pricingId: pricingId
        }
    })

    return res
}

const changeInvoiceStatus = async(invoiceId, status, creditCard) => {
    const res = await axios({
        method: 'put',
        url: `${api.url}/api/invoices/${invoiceId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
        data: {
            newStatus: status,
            creditCard: creditCard
        }
    })

    return res
}

const deleteInvoice = async(invoiceId) => {
    const res = await axios({
        method: 'delete',
        url: `${api.url}/api/invoices/${invoiceId}`,
        headers: {
            'x-access-token': localStorage.getItem('X-Auth-Token')
        },
    })

    return res
}

const invoiceService = {
    getInvoices,
    getOneInvoice,
    addInvoice,
    changeInvoiceStatus,
    deleteInvoice
}

export default invoiceService