module.exports = (sequelize, Sequelize) => {
    const Design = sequelize.define('Design', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId:{
                type: Sequelize.INTEGER,
                field: 'user_id'
            },
            creatorId:{
                type: Sequelize.INTEGER,
                field: 'creator_id'
            },
            title: {
                type: Sequelize.STRING,
                field: 'title'
            },
            description:{
                type: Sequelize.STRING,
                field: 'description'
            },
            public: {
                type: Sequelize.BOOLEAN,
                field: 'public'
            },
            width: {
                type: Sequelize.FLOAT,
                field: 'width'
            },
            height: {
                type: Sequelize.FLOAT,
                field: 'height'
            },
            elements: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                field: 'elements'
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
            tableName: 'designs',
            timestamps: true,
            underscored: true,
        }
    );
    return Design
};