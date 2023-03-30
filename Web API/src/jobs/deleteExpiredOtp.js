const { Op } = require("sequelize");
const CronJob = require('cron').CronJob;

const db = require('../models/index')
const Otp = db.otp

const handleDeleteExpiredOtp = async () => {
    try {
        console.log('Bat dau delete otp')
        const currentTime = new Date()
        await Otp.destroy({
            where: {
                expireTime: {
                    [Op.lt]: currentTime
                }
            }
        })
        console.log('Ket thuc delete otp')
    } catch (err) {
        console.log(err)
    }
}

const deleteExpiredOtp = () => {
    var job = new CronJob('*/10 * * * * *', handleDeleteExpiredOtp, null, true, 'America/Los_Angeles');
    job.start();
}

module.exports = deleteExpiredOtp