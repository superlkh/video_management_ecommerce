const http_status = require('../http_responses/status.response.js')
const invoiceService = require('../services/invoice.service')

const getInvoices = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await invoiceService.getInvoices(req.userId, req.query.page)
        resObj.data = result
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const getOneInvoice = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await invoiceService.getOneInvoice(req.userId, req.params.invoiceId)
        if(!result){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
        resObj.data = result
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const addInvoice = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await invoiceService.addInvoice(req.userId, req.body.pricingId)
        if(!result){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        } else {
            resObj.data = result
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

// Thay đổi trạng thái của invoice
// Dùng để thay trạng thái của invoice = đã trả tiền
const changeStatus = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await invoiceService.changeStatus(req.userId, req.params.invoiceId, req.body.newStatus, req.body.creditCard)
        if(!result || result[0] === 0){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}

const deleteInvoice = async(req, res) => {
    let resObj = {
        status: http_status.HTTP_RESPONE_STATUS_OK,
        errors: null,
        data: null,
    }

    try {
        const result = await invoiceService.deleteInvoice(req.userId, req.params.invoiceId)
        console.log(result)
        if(result[0] === 0){
            resObj.status = http_status.HTTP_RESPONE_STATUS_INVALID_REQUEST
        }
    } catch (error) {
        resObj.status = http_status.HTTP_RESPONE_STATUS_UNKNOWN_ERROR
        resObj.errors = error
    }

    return res.json(resObj)
}


module.exports = {
    getInvoices,
    addInvoice,
    getOneInvoice,
    changeStatus,
    deleteInvoice
}