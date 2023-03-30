// User model 
// Read https://sequelize.org/master/manual/model-basics.html to understand


module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            field: 'user_name'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        country: {
            type: Sequelize.STRING,
            field: 'country'
        },
        avatarUrl: {
            type: Sequelize.STRING,
            field: 'avatar_url'
        },
        otp: {
            type: Sequelize.STRING,
            filed: 'otp',
            defaultValue: ''
        },
        memory: {
            type: Sequelize.BIGINT,
            field: 'memory',
            defaultValue: 0
        },
        totalMemory: {
            type: Sequelize.BIGINT,
            field: 'total_memory',
            defaultValue: 5368709120
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            field: 'deleted',
            defaultValue: false
        },
        pushSubscription: {
            type: Sequelize.JSON,
            field: 'push_subscription',
            defaultValue: {}
        }
    },{
        timestamps: true,
        underscored: true,
        tableName: 'users'
    })

    return User
}