const sequelize = require('../loaders/sequelize')
const Sequelize = require('sequelize')

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
db.sequelize.sync({ alter: true })
// db.sequelize.sync({ force: true }).then(() => {
//     initial()
// })

db.user = require('./user.model')(sequelize, Sequelize)
db.role = require('./role.model')(sequelize, Sequelize)
db.folder = require('./folder.model')(sequelize, Sequelize)
db.attachment = require('./attachments.model')(sequelize, Sequelize)
db.project = require('./project.model')(sequelize, Sequelize)
db.user_project = require('./user_project.model')(sequelize, Sequelize)
db.comment = require('./comments.model')(sequelize, Sequelize)
db.notification = require('./notifications.model')(sequelize, Sequelize)
db.pricing = require('./pricings.model')(sequelize, Sequelize)
db.invoice = require('./invoice.model')(sequelize, Sequelize)
db.creditCard = require('./creditCards.model')(sequelize, Sequelize)
db.otp = require('./otp.model')(sequelize, Sequelize)
db.cloudinary = require('./cloudinary.model')(sequelize, Sequelize)
db.googleAccount = require('./googleAccount.model')(sequelize, Sequelize)

// Design App
db.designs = require('./designs.model')(sequelize, Sequelize)
db.elements = require('./elements.model')(sequelize, Sequelize)
db.shapes = require('./shapes.model')(sequelize, Sequelize)
db.text = require('./text.model')(sequelize, Sequelize)
// User-Role Relationship: many-to-many
// More details and examples at https://www.bezkoder.com/sequelize-associate-many-to-many/
// db.role.hasMany(db.user)
// db.user.belongsTo(db.role)



db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
})

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
})


db.project.hasMany(db.folder)
db.folder.hasMany(db.attachment)

db.user.hasMany(db.notification)
db.notification.belongsTo(db.user, {foreignKey: 'create_uid'})
// Quan hệ giữa user-comment và comment-attachment
db.user.hasMany(db.comment)
db.attachment.hasMany(db.comment)

// KHÔNG ĐƯỢC SỬA THỨ TỰ ĐẶT CODE CỦA QUAN HỆ GIỮA CÁC BẢNG BÊN DƯỚI
// Mỗi user tham gia nhiều project
db.user.belongsToMany(db.project, {
    through: db.user_project,
    foreignKey: 'user_id'
})
// Mỗi project được nhiều user tham gia
db.project.belongsToMany(db.user, {
    through: db.user_project,
    foreignKey: 'project_id'
})
// Mỗi user sở hữu nhiều project
db.user.hasMany(db.project)


db.user.hasMany(db.invoice)
db.invoice.belongsTo(db.pricing)

db.user.hasMany(db.creditCard)

db.user.hasMany(db.otp)

db.user.hasMany(db.cloudinary)

db.user.hasOne(db.googleAccount)

// Design app
db.user.hasMany(db.designs)
db.designs.hasMany(db.elements)

db.ROLES = ['user', 'admin', 'moderator']

const Role = db.role
const Pricing = db.pricing
const CreditCard = db.creditCard
// Initialize database
function initial() {
    Role.create({
        id: 1,
        name: 'user'
    })
    Role.create({
        id: 2,
        name: 'moderator'
    })
    Role.create({
        id: 3,
        name: 'admin'
    })

    Pricing.create({
        pricingName: 'Normal',
        price: 0,
        storage: 5
    })
    Pricing.create({
        pricingName: 'Pro',
        price: 10,
        storage: 20
    })
    Pricing.create({
        pricingName: 'Enterprise',
        price: 20,
        storage: 50
    })

    CreditCard.create({
            cardNumber: 5555555555554444,
            cardName: 'Phan Võ Minh Huy',
            cvc: 123,
            date: '12/2021',
            balance: 1000,
        })
    CreditCard.create({
            cardNumber: 4111111111111111,
            cardName: 'LU KHANH HOANG',
            cvc: 321,
            date: '12/19/2021',
            balance: 1000,
        })
    CreditCard.create({
            cardNumber: 5105105105105100,
            cardName: 'Phan Võ Minh Huy',
            cvc: 231,
            date: '12/2021',
            balance: 1000,
        })


}



module.exports = db


//folder.sync({alter:true})

