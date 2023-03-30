module.exports = (sequelize, Sequelize) => {
    const GoogleAccount = sequelize.define('googleAccounts', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.BIGINT,
                field: 'user_id'
            },
            accessToken: {
                type: Sequelize.TEXT,
                field: 'access_token'
            },
            refreshToken: {
                type: Sequelize.TEXT,
                field: 'refresh_token'
            },
            scope: {
                type: Sequelize.TEXT,
                field: 'scope'
            },
            idToken: {
                type: Sequelize.TEXT,
                field: 'id_token'
            },
            tokenType: {
                type: Sequelize.STRING,
                field: 'token_type'
            },
            expiryDate: {
                type: Sequelize.STRING,
                field: 'expiry_date'
            },
            name: {
                type: Sequelize.STRING,
                field: 'name',
            },
            googleAccountId: {
                type: Sequelize.STRING,
                field: 'google_account_id'
            },
            picture: {
                type: Sequelize.STRING,
                field: 'picture'
            }
        }, 
        {
            tableName: 'google_accounts',
            timestamps: true,
            underscored: true,
        }
    )
     
    return GoogleAccount
}