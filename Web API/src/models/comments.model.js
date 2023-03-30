module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('Comment', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            userId:{
                type: Sequelize.INTEGER,
                field: 'user_id'
            },
            attachmentId:{
                type: Sequelize.INTEGER,
                field: 'attachment_id'
            },
            content:{
                type: Sequelize.STRING,
                field: 'content'
            },
            commentParentId:{
                type: Sequelize.BIGINT,
                field: 'comment_parent_id'
            },
            createdAt: { 
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: { 
                type: Sequelize.DATE,
                field: 'updated_at'
            }
        }, 
        {
            tableName: 'comments',
            timestamps: true,
            underscored: true,
        }
    );
    return Comment
};