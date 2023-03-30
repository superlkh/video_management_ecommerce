module.exports = (sequelize, Sequelize) => {
    const UserProject = sequelize.define('UserProject', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            userId:{
                type: Sequelize.INTEGER,
                field: 'user_id'
            },
            projectId:{
                type: Sequelize.INTEGER,
                field: 'project_id'
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
            tableName: 'user_projects',
            timestamps: true,
            underscored: true,
        }
    );
    return UserProject
};