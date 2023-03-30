module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define('Notification', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            type: {   //CRUD
                type: Sequelize.BIGINT,
                field: 'type'
            },
            subject: {
                type: Sequelize.INTEGER,
                field: 'subject'
            },
            content: {
                type: Sequelize.STRING,
                field: 'content'
            },
            status: { //false: Unread, true: Read
                type: Sequelize.BOOLEAN,
                field: 'status'
            },
            createdAt: { 
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: { 
                type: Sequelize.DATE,
                field: 'updated_at'
            },
            createUid: {
                type: Sequelize.INTEGER,
                field: 'create_uid'
            },
            userId:{
                type: Sequelize.INTEGER,
                field: 'user_id'
            }
        }, 
        {
            tableName: 'notifications',
            timestamps: true,
            underscored: true,
        }
    )
     
    return Notification
}