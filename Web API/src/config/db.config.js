// Sequelize constructor
// More details at https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor

require('dotenv').config()

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DB,
    dialect: process.env.DB_dialect,
    // optional
    pool:{
        // maximum number of connection in pool
        max: 8,            
        // minimum number of connection in pool
        min: 0,             
        // maximum time, in milisecond, that pool will try to get connection before throwing error
        acquire: 30000,     
        // maximum time, in milliseconds, that a connection can be idle before being released
        idle: 10000
    }
}