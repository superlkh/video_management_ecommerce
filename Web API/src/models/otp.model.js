module.exports = (sequelize, Sequelize) => {
    const Otp = sequelize.define('otps', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.BIGINT,
                field: 'user_id'
            },
            secret: {
                type: Sequelize.STRING,
                field: 'secret'
            },
            Option: {
                type: Sequelize.STRING,
                field: 'otp'
            },
            expireTime: {
                type: Sequelize.DATE,
                field: 'expire_time'
            }
        }, 
        {
            tableName: 'otps',
            timestamps: true,
            underscored: true,
        }
    )
     
    return Otp
}