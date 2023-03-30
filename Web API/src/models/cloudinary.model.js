module.exports = (sequelize, Sequelize) => {
    const Cloudinary = sequelize.define('cloudinarys', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.BIGINT,
                field: 'user_id'
            },
            cloudName: {
                type: Sequelize.STRING,
                field: 'cloud_name'
            },
            apiKey: {
                type: Sequelize.STRING,
                field: 'api_key'
            },
            apiSecret: {
                type: Sequelize.STRING,
                field: 'api_secret'
            }
        }, 
        {
            tableName: 'cloudinarys',
            timestamps: true,
            underscored: true,
        }
    )
     
    return Cloudinary
}