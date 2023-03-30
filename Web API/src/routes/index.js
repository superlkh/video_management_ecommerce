const folder = require('./folder.routes')
const auth = require('./auth.routes')
const user = require('./user.routes')
const upload = require('./upload.routes')
const video = require('./video.routes')
const project = require('./project.routes')
const image = require('./image.routes')
const notification = require('./notification.routes')
const invoice = require('./invoice.routes')
const connect = require('./connect.route')
const designs = require('./designs.routes')

function route(app) {
    // app.get('/', (req,res) => {
    //     res.json({message: 'Welcome to KLTN Video API'})
    // })
    app.use('/folder', folder)
    app.use('/', auth)
    app.use('/', user)
    app.use('/', upload)
    app.use('/', video)
    app.use('/', project)
    app.use('/image', image)
    app.use('/', notification)
    app.use('/', invoice)
    app.use('/', connect)
    app.use('/', designs)
}

module.exports = route