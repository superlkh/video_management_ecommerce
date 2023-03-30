// Khóa luận tốt nghiệp K17
//1753061 - Phan Võ Minh Huy

const express = require('express')
const loaders = require('./loaders/index')
const root = require('./routes/index')
const jobs = require('./jobs/index')

async function startServer() {
    const app = express();
    const port = process.env.port || 5000

    await loaders({ expressApp: app });

    root(app)

    // jobs.addTags()
    // jobs.deleteExpiredOtp()

    app.listen(port, () => {
        console.log(`Server is listening at port ${port}`)
    })
}

startServer();


