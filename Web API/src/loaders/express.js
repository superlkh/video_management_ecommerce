const express = require('express')
const expressFileUpload = require('express-fileupload')
const cors = require('cors')

async function expressLoader ({ app }) {
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))

    app.use(expressFileUpload())
    
    const cors_option = {
        origin: 'http://localhost:3000'
    }
    app.use(cors(cors_option))
    
    return app;
}

module.exports = expressLoader