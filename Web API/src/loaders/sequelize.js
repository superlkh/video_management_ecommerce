const Sequelize = require('sequelize')
const config = require('../config/db.config.js')


var sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    //port: 5432,
    //logging: false,
    host: config.HOST,
    dialect: config.dialect,
    operatorAliases: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
});

module.exports = sequelize