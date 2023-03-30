const express = require('express')
const authJwt = require('../middlewares/authJwt')
const router = express.Router()
const invoiceController = require('../controllers/invoice.controller')

router.get('/api/invoices', authJwt.verifyToken, invoiceController.getInvoices)
router.get('/api/invoices/:invoiceId', authJwt.verifyToken, invoiceController.getOneInvoice)

router.post('/api/invoices', authJwt.verifyToken, invoiceController.addInvoice)

router.put('/api/invoices/:invoiceId', authJwt.verifyToken, invoiceController.changeStatus)

router.delete('/api/invoices/:invoiceId', authJwt.verifyToken, invoiceController.deleteInvoice)

module.exports = router