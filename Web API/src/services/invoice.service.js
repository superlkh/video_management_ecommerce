const db = require('../models')
const Invoice = db.invoice
const Pricing = db.pricing
const CreditCard = db.creditCard
// const nodeMailer = require('nodemailer')

const getInvoices = async(userId, page) => {

    if(!page){
        page = 1
    }
    const invoices = await Invoice.findAndCountAll({
        where: {
            userId: userId
        },
        limit: 5,
        offset: (parseInt(page) - 1) * 5,
        order: ['status']
    })

    return invoices
}

const getOneInvoice = async(userId, invoiceId) => {
    const invoice = await Invoice.findOne({
        where: {
            userId: userId,
            uuid: invoiceId
        }
    })

    if(!invoice){
        return
    }

    const pricing = await Pricing.findOne({
        where: {
            id: invoice.dataValues.pricingId
        }
    })

    if(!pricing){
        return
    }

    const result = {
        invoice: invoice,
        pricing: pricing
    }

    return result
}

const addInvoice = async(userId, pricingId) => {

    const newInvoice = await Invoice.create({
        userId: userId,
        pricingId: pricingId,
        status: 0
    })

    return newInvoice
}

const changeStatus = async(userId, invoiceId, newStatus, creditCard) => {
    if(creditCard){
        if(!creditCard.cardName || !creditCard.cardNumber || !creditCard.cvc || !creditCard.date){
            return
        }
        const updateCard = await CreditCard.update({
            balance: 1000 - creditCard.cost
        }, {
            where: {
                cardNumber: creditCard.cardNumber,
                cardName: creditCard.cardName,
                date: creditCard.date,
                cvc: creditCard.cvc
            }
        })

        if (updateCard[0] === 0){
            return
        }
    }

    const result = await Invoice.update({
        status: newStatus,
        paymentDate: new Date()
    }, {
        where: {
            uuid: invoiceId,
            userId: userId
        }
    })

    return result
}

const deleteInvoice = async(userId, invoiceId) => {
    const result = await Invoice.destroy({
        where: {
            userId: userId,
            id: invoiceId
        }
    })

    return result
}

module.exports = {
    getInvoices,
    addInvoice,
    getOneInvoice,
    changeStatus,
    deleteInvoice
}

